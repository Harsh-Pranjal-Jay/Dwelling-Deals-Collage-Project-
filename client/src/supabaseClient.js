import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldpbtlkehwfdwercibyo.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcGJ0bGtlaHdmZHdlcmNpYnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTcyNjAsImV4cCI6MjA1OTA5MzI2MH0.dsQbHNpgt5_oR8nYJuTgDFT6RJGg57cvEXt_XfW3tfI";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;