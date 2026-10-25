package com.smartpoultry.yemen;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.UpdateAvailability;

@CapacitorPlugin(name = "PoultryAppUpdate")
public class PoultryAppUpdatePlugin extends Plugin {
    private AppUpdateManager manager;
    private AppUpdateInfo lastInfo;
    private static final int UPDATE_REQUEST = 9150;

    @Override
    public void load() {
        manager = AppUpdateManagerFactory.create(getContext());
    }

    @PluginMethod
    public void checkForUpdate(PluginCall call) {
        manager.getAppUpdateInfo().addOnSuccessListener(info -> {
            lastInfo = info;
            boolean available = info.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE && info.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE);
            JSObject result = new JSObject();
            result.put("updateAvailable", available);
            result.put("availableVersionCode", info.availableVersionCode());
            result.put("currentVersionCode", BuildConfig.VERSION_CODE);
            call.resolve(result);
        }).addOnFailureListener(error -> call.reject("Google Play update check failed. The app may not be installed from Play Store.", error));
    }

    @PluginMethod
    public void startImmediateUpdate(PluginCall call) {
        if (lastInfo == null || lastInfo.updateAvailability() != UpdateAvailability.UPDATE_AVAILABLE) {
            call.reject("No Google Play update is currently available. Run checkForUpdate first.");
            return;
        }
        try {
            boolean started = manager.startUpdateFlowForResult(lastInfo, AppUpdateType.IMMEDIATE, getActivity(), UPDATE_REQUEST);
            JSObject result = new JSObject(); result.put("started", started); call.resolve(result);
        } catch (Exception ex) { call.reject("Unable to start Google Play in-app update", ex); }
    }
}
