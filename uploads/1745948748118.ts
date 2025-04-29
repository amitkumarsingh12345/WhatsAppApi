import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system';
import axios from "axios";
import { allConstant } from "@/src/constants/Constant";

export default function CareerForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    experience: "",
    esalary: "",
    qualification: "",
    job: "",
    cemp: "",
    resume: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug form state changes
  useEffect(() => {
    console.log("Form state updated:", {
      ...form,
      resume: form.resume ? {
        name: form.resume.name,
        size: form.resume.size,
        uri: form.resume.uri?.substring(0, 30) + '...',
        type: form.resume.type
      } : null
    });
  }, [form]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const pickResume = async () => {
    try {
      console.log("Starting document picker...");
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false
      });

      console.log("Picker result:", {
        type: result.type,
        canceled: result.canceled,
        assets: result.assets ? result.assets.map(a => ({
          name: a.name,
          size: a.size,
          uri: a.uri.substring(0, 30) + '...',
          mimeType: a.mimeType
        })) : null
      });

      if (result.type === "success" && !result.canceled && result.assets) {
        const file = result.assets[0];
        
        // Verify file exists
        try {
          const fileInfo = await FileSystem.getInfoAsync(file.uri);
          console.log("File info:", fileInfo);
          
          if (!fileInfo.exists) {
            throw new Error("File doesn't exist at URI");
          }

          const processedFile = {
            uri: file.uri,
            name: file.name || `resume_${Date.now()}`,
            type: file.mimeType || "*/*",
            size: file.size
          };

          console.log("Setting resume:", processedFile);
          setForm({ ...form, resume: processedFile });
        } catch (file