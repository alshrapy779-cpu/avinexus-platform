package com.smartpoultry.yemen;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.os.Build;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CapacitorPlugin(
    name = "PoultryHardware",
    permissions = {
        @Permission(alias = "bluetoothConnect", strings = { Manifest.permission.BLUETOOTH_CONNECT }),
        @Permission(alias = "bluetoothScan", strings = { Manifest.permission.BLUETOOTH_SCAN })
    }
)
public class PoultryHardwarePlugin extends Plugin {
    private static final UUID SPP_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    private boolean needsRuntimeBluetoothPermission() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.S;
    }

    private boolean ensureBluetoothPermission(PluginCall call, String callback) {
        if (!needsRuntimeBluetoothPermission()) return true;
        if (getPermissionState("bluetoothConnect") != PermissionState.GRANTED) {
            requestPermissionForAlias("bluetoothConnect", call, callback);
            return false;
        }
        return true;
    }

    @PluginMethod
    public void getPairedDevices(PluginCall call) {
        if (!ensureBluetoothPermission(call, "pairedPermissionCallback")) return;
        doGetPairedDevices(call);
    }

    @PermissionCallback
    private void pairedPermissionCallback(PluginCall call) {
        if (getPermissionState("bluetoothConnect") == PermissionState.GRANTED) doGetPairedDevices(call);
        else call.reject("Bluetooth permission denied");
    }

    private void doGetPairedDevices(PluginCall call) {
        try {
            BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
            if (adapter == null) { call.reject("Bluetooth is not supported on this device"); return; }
            JSArray devices = new JSArray();
            Set<BluetoothDevice> bonded = adapter.getBondedDevices();
            for (BluetoothDevice device : bonded) {
                JSObject item = new JSObject();
                item.put("name", device.getName());
                item.put("address", device.getAddress());
                devices.put(item);
            }
            JSObject result = new JSObject();
            result.put("devices", devices);
            call.resolve(result);
        } catch (SecurityException ex) { call.reject("Bluetooth permission is required", ex); }
        catch (Exception ex) { call.reject("Unable to read paired devices", ex); }
    }

    @PluginMethod
    public void printEscPos(PluginCall call) {
        if (!ensureBluetoothPermission(call, "printPermissionCallback")) return;
        doPrint(call);
    }

    @PermissionCallback
    private void printPermissionCallback(PluginCall call) {
        if (getPermissionState("bluetoothConnect") == PermissionState.GRANTED) doPrint(call);
        else call.reject("Bluetooth permission denied");
    }

    private void doPrint(PluginCall call) {
        final String address = call.getString("address", "");
        final String text = call.getString("text", "");
        if (address.isEmpty()) { call.reject("Printer Bluetooth address is required"); return; }
        new Thread(() -> {
            BluetoothSocket socket = null;
            try {
                BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                BluetoothDevice device = adapter.getRemoteDevice(address);
                socket = device.createRfcommSocketToServiceRecord(SPP_UUID);
                adapter.cancelDiscovery();
                socket.connect();
                OutputStream out = socket.getOutputStream();
                out.write(new byte[]{0x1B, 0x40}); // ESC @ initialize
                out.write(text.getBytes(StandardCharsets.UTF_8));
                out.write("\n\n\n".getBytes(StandardCharsets.UTF_8));
                out.flush();
                JSObject result = new JSObject(); result.put("success", true); call.resolve(result);
            } catch (Exception ex) { call.reject("Bluetooth printer connection failed", ex); }
            finally { try { if (socket != null) socket.close(); } catch (Exception ignored) {} }
        }).start();
    }

    @PluginMethod
    public void readScale(PluginCall call) {
        if (!ensureBluetoothPermission(call, "scalePermissionCallback")) return;
        doReadScale(call);
    }

    @PermissionCallback
    private void scalePermissionCallback(PluginCall call) {
        if (getPermissionState("bluetoothConnect") == PermissionState.GRANTED) doReadScale(call);
        else call.reject("Bluetooth permission denied");
    }

    private void doReadScale(PluginCall call) {
        final String address = call.getString("address", "");
        final int timeoutMs = call.getInt("timeoutMs", 4500);
        if (address.isEmpty()) { call.reject("Scale Bluetooth address is required"); return; }
        new Thread(() -> {
            BluetoothSocket socket = null;
            try {
                BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                BluetoothDevice device = adapter.getRemoteDevice(address);
                socket = device.createRfcommSocketToServiceRecord(SPP_UUID);
                adapter.cancelDiscovery();
                socket.connect();
                InputStream in = socket.getInputStream();
                long end = System.currentTimeMillis() + timeoutMs;
                StringBuilder buffer = new StringBuilder();
                byte[] temp = new byte[256];
                while (System.currentTimeMillis() < end) {
                    int available = in.available();
                    if (available > 0) {
                        int n = in.read(temp, 0, Math.min(temp.length, available));
                        if (n > 0) buffer.append(new String(temp, 0, n, StandardCharsets.US_ASCII));
                        if (buffer.indexOf("\n") >= 0 || buffer.indexOf("\r") >= 0) break;
                    } else Thread.sleep(60);
                }
                String raw = buffer.toString().trim();
                Pattern p = Pattern.compile("[-+]?\\d+(?:[\\.,]\\d+)?");
                Matcher m = p.matcher(raw.replace(',', '.'));
                Double value = m.find() ? Double.parseDouble(m.group()) : null;
                String unit = raw.toLowerCase().contains("kg") ? "kg" : raw.toLowerCase().contains(" g") ? "g" : "kg";
                JSObject result = new JSObject();
                result.put("success", true); result.put("raw", raw); result.put("unit", unit);
                if (value != null) result.put("value", value);
                call.resolve(result);
            } catch (Exception ex) { call.reject("Bluetooth scale reading failed", ex); }
            finally { try { if (socket != null) socket.close(); } catch (Exception ignored) {} }
        }).start();
    }
}
