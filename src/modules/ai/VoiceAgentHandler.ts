import { VoiceAgentSessionV19 } from '../../types';
import { parseFieldMediaTranscriptV19 } from '../chat/MediaDataParser';

export function createVoiceAgentSessionV19(speakerName:string,role:string,transcript:string):VoiceAgentSessionV19{
  const fields=parseFieldMediaTranscriptV19(transcript);
  const medicalTerms=/علاج|جرعة|مضاد|لقاح|نفوق|تشريح|إسهال|اسهال/.test(transcript);
  return {id:`voice19-${Date.now()}`,created_at:new Date().toISOString(),speaker_name:speakerName,role,dialect:'yemeni_arabic',transcript,
    extracted_intent:fields.length?'daily_flock_update':medicalTerms?'clinical_question':'general_field_message',extracted_fields:fields.map(x=>x.key),status:medicalTerms&&!fields.length?'needs_review':'processed'};
}
