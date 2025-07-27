"use client";

import { useRef, useState, useEffect } from "react";
import kycFields from "../../kyc_fields.json";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import VoiceSettingsPage from "./pages/VoiceSettingsPage";

export default function Home() {
  const socket = useRef(null);
  const audioContext = useRef(null);
  const mediaStream = useRef(null);
  const scriptProcessor = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState({});
  const [currentField, setCurrentField] = useState(null);
  const [formData, setFormData] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [lastTranscript, setLastTranscript] = useState("");
  const [apiCallCounter, setApiCallCounter] = useState(0);
  const [fieldCompletionStatus, setFieldCompletionStatus] = useState("");
  const [currentPage, setCurrentPage] = useState("kyc-forms");
  const [isAutoMode, setIsAutoMode] = useState(false);
  const debounceTimer = useRef(null);
  const lastActivityTimer = useRef(null);

  const getToken = async () => {
    const response = await fetch("/api/token");
    const data = await response.json();

    if (!data || !data.token) {
      alert("Failed to get token");
      return null;
    }

    return data.token;
  };

  const processTranscriptByFieldType = async (
    transcript,
    fieldType,
    fieldKey,
    callId
  ) => {
    setProcessingStatus(`Processing ${fieldKey}...`);

    try {
      const extractedValue = await extractDataWithAI(
        transcript,
        fieldType,
        fieldKey
      );
      console.log("API response for", fieldKey, ":", extractedValue);

      setProcessingStatus("");
      return extractedValue;
    } catch (error) {
      console.error("Processing error:", error);
      setProcessingStatus(`Error processing ${fieldKey}`);
      setTimeout(() => setProcessingStatus(""), 3000);
      return transcript;
    }
  };

  const getNextField = (currentCategory, currentFieldKey) => {
    const categories = Object.keys(kycFields);
    const currentCategoryIndex = categories.indexOf(currentCategory);
    const fieldsInCategory = Object.keys(kycFields[currentCategory]);
    const currentFieldIndex = fieldsInCategory.indexOf(currentFieldKey);

    // Check if there's a next field in the current category
    if (currentFieldIndex < fieldsInCategory.length - 1) {
      return {
        category: currentCategory,
        fieldKey: fieldsInCategory[currentFieldIndex + 1]
      };
    }

    // Check if there's a next category
    if (currentCategoryIndex < categories.length - 1) {
      const nextCategory = categories[currentCategoryIndex + 1];
      const firstFieldInNextCategory = Object.keys(kycFields[nextCategory])[0];
      return {
        category: nextCategory,
        fieldKey: firstFieldInNextCategory
      };
    }

    // No more fields
    return null;
  };

  const processWhenSilent = async (
    transcript,
    fieldConfig,
    fieldKey,
    category
  ) => {
    console.log("Processing transcript:", transcript, "for field:", fieldKey);

    const processedValue = await processTranscriptByFieldType(
      transcript.trim(),
      fieldConfig.type,
      fieldKey
    );

    console.log("Processed value:", processedValue, "for field:", fieldKey);

    if (processedValue && processedValue.trim() && processedValue !== "BLANK") {
      const fieldPath = `${category}.${fieldKey}`;
      console.log(
        "Updating form data for:",
        fieldPath,
        "with value:",
        processedValue
      );

      setFormData((prev) => {
        const updated = {
          ...prev,
          [fieldPath]: processedValue,
        };
        console.log("New form data:", updated);
        return updated;
      });

      // Show success feedback
      setFieldCompletionStatus(
        "✅ Field completed! Moving to next field..."
      );
      setProcessingStatus("");

      // Auto-stop recording and move to next field
      console.log("Auto-stopping recording and moving to next field");
      setTimeout(() => {
        stopRecording();
        setFieldCompletionStatus("");
        
        // Find and start recording for the next field
        const nextField = getNextField(category, fieldKey);
        if (nextField) {
          console.log("Starting recording for next field:", nextField);
          setTimeout(() => {
            startRecordingForField(nextField.fieldKey, nextField.category);
          }, 500); // Small delay before starting next field
        } else {
          console.log("All fields completed!");
          setFieldCompletionStatus("🎉 All fields completed!");
          setIsAutoMode(false);
          setTimeout(() => setFieldCompletionStatus(""), 3000);
        }
      }, 1500); // Small delay to show the success state
    }
  };

  const extractDataWithAI = async (transcript, fieldType, fieldKey) => {
    const prompt = createPromptForField(transcript, fieldType, fieldKey);
    const encodedPrompt = encodeURIComponent(prompt);
    const apiUrl = `${process.env.CLOUDFLARE_API_URL}?prompt=${encodedPrompt}`;

    console.log("Making API call for", fieldKey, "with prompt:", prompt);

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log("API response data:", data);

      if (data.success && data.response?.response) {
        const extractedValue = data.response.response.trim();
        console.log("Extracted value from API:", extractedValue);
        return extractedValue;
      } else {
        console.error("API response was not successful:", data);
        throw new Error("API response was not successful");
      }
    } catch (error) {
      console.error("API call failed:", error);
      return transcript;
    }
  };

  // Current date only matters if you want to allow "today / tomorrow" etc.
  // Pass it in if you need that. Otherwise you can drop the `today` param.
  const createPromptForField = (
    transcript,
    fieldType,
    fieldKey,
    today /* 'YYYY-MM-DD' */
  ) => {
    const BASE_RULES = `
You MUST follow these rules:
- Output ONLY the final value. No labels, no explanations, no quotes.
- Trim whitespace. No trailing punctuation.
- If you cannot find a valid value, output BLANK.
- Never guess or fabricate missing parts.
- Do not echo the transcript back.
`;

    const SRC = `Transcript:\n"""${transcript}"""`;

    switch (fieldType) {
      case "email": {
        return `
Extract the email address from the transcript.
${BASE_RULES}
Normalisation rules:
- Convert spoken separators like " at " -> "@", " dot " -> ".", " underscore " -> "_", " dash " -> "-".
- Remove spaces.
- Lowercase the result.
- Return BLANK if no valid single email can be formed.

${SRC}
`.trim();
      }

      case "tel": {
        return `
Extract the Indian phone number (mobile) from the transcript.
${BASE_RULES}
Normalisation & validation:
- Convert any spoken numbers to digits.
- Ignore country code (+91) or leading 0 if present.
- Return exactly 10 digits (##########) with no spaces, dashes, or symbols.
- If you cannot find exactly 10 digits that form a plausible Indian mobile, return BLANK.

${SRC}
`.trim();
      }

      case "date": {
        return `
Extract a single calendar date from the transcript and format it as YYYY-MM-DD.
${BASE_RULES}
Parsing rules:
- Handle spoken formats like "15th January 1990", "1/5/1990", "05-01-1990", etc.
- Prefer DMY ordering when ambiguous (India).
- If relative dates like "today", "tomorrow", "next Monday" appear${
          today ? `, resolve them relative to ${today}` : ""
        }.
- If multiple dates are mentioned, choose the most specific, earliest one said.
- If the year is missing, return BLANK (do not assume).

${SRC}
`.trim();
      }

      case "text": {
        switch (fieldKey) {
          case "firstName":
            return `
Extract ONLY the first name.
${BASE_RULES}
- Remove titles (Mr, Ms, Dr, etc.).
- Properly capitalize (e.g., "rAhul" -> "Rahul").

${SRC}
`.trim();

          case "lastName":
            return `
Extract ONLY the last name (surname/family name).
${BASE_RULES}
- Remove titles.
- Properly capitalize.

${SRC}
`.trim();

          case "street":
            return `
Extract the street address ONLY (no city/state/country/pin).
${BASE_RULES}
- Properly capitalize.
- Remove introductory phrases like "my address is".

${SRC}
`.trim();

          case "city":
            return `
Extract ONLY the city name.
${BASE_RULES}
- Properly capitalize.
- Remove introductory phrases.

${SRC}
`.trim();

          case "state":
            return `
Extract ONLY the Indian state or union territory name.
${BASE_RULES}
- Properly capitalize the full name (e.g., "tN" -> "Tamil Nadu").
- Do not return abbreviations unless the transcript ONLY gives an abbreviation.

${SRC}
`.trim();

          case "zipCode":
          case "pin":
          case "postalCode":
            return `
Extract ONLY the Indian PIN code.
${BASE_RULES}
- It must be exactly 6 digits.
- If not found, return BLANK.

${SRC}
`.trim();

          case "country":
            return `
Extract ONLY the country name.
${BASE_RULES}
- Properly capitalize.
- Remove introductory phrases.

${SRC}
`.trim();

          default:
            return `
Extract the requested ${fieldKey} value.
${BASE_RULES}

${SRC}
`.trim();
        }
      }

      default:
        return `
Extract the requested information for field "${fieldKey}".
${BASE_RULES}

${SRC}
`.trim();
    }
  };

  const startRecordingForField = async (fieldKey, category) => {
    const token = await getToken();
    if (!token) return;

    setCurrentField({ key: fieldKey, category });
    setIsListening(true);

    const wsUrl = `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&formatted_finals=true&token=${token}`;
    socket.current = new WebSocket(wsUrl);

    const turns = {};

    socket.current.onopen = async () => {
      console.log("WebSocket connection established");
      setIsRecording(true);

      mediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioContext.current = new AudioContext({ sampleRate: 16000 });

      const source = audioContext.current.createMediaStreamSource(
        mediaStream.current
      );
      scriptProcessor.current = audioContext.current.createScriptProcessor(
        4096,
        1,
        1
      );

      source.connect(scriptProcessor.current);
      scriptProcessor.current.connect(audioContext.current.destination);

      scriptProcessor.current.onaudioprocess = (event) => {
        if (!socket.current || socket.current.readyState !== WebSocket.OPEN)
          return;

        const input = event.inputBuffer.getChannelData(0);
        const buffer = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          buffer[i] = Math.max(-1, Math.min(1, input[i])) * 0x7fff;
        }
        socket.current.send(buffer.buffer);
      };
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "Turn") {
        const { turn_order, transcript } = message;
        turns[turn_order] = transcript;

        const ordered = Object.keys(turns)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => turns[k])
          .join(" ");

        setTranscripts({ ...turns });

        if (ordered.trim()) {
          const fieldConfig = kycFields[category][fieldKey];
          setLastTranscript(ordered.trim());

          // Clear existing timer
          if (lastActivityTimer.current) {
            clearTimeout(lastActivityTimer.current);
          }

          // Set timer to process after 3 seconds of no new transcript updates
          lastActivityTimer.current = setTimeout(() => {
            processWhenSilent(ordered.trim(), fieldConfig, fieldKey, category);
          }, 3000);
        }
      }
    };

    socket.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      stopRecording();
    };

    socket.current.onclose = () => {
      console.log("WebSocket closed");
      socket.current = null;
    };
  };

  const startAutoVoiceInput = () => {
    setIsAutoMode(true);
    // Start with the first field
    const firstCategory = Object.keys(kycFields)[0];
    const firstField = Object.keys(kycFields[firstCategory])[0];
    startRecordingForField(firstField, firstCategory);
  };

  const stopAutoVoiceInput = () => {
    setIsAutoMode(false);
    stopRecording();
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsListening(false);
    setCurrentField(null);
    setProcessingStatus("");
    if (!isAutoMode) {
      setFieldCompletionStatus("");
    }

    // Clear any pending processing timers
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    if (lastActivityTimer.current) {
      clearTimeout(lastActivityTimer.current);
      lastActivityTimer.current = null;
    }

    if (scriptProcessor.current) {
      scriptProcessor.current.disconnect();
      scriptProcessor.current = null;
    }

    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
      mediaStream.current = null;
    }

    if (socket.current) {
      socket.current.send(JSON.stringify({ type: "Terminate" }));
      socket.current.close();
      socket.current = null;
    }
  };

  const renderFormField = (fieldKey, fieldConfig, category) => {
    const fullFieldKey = `${category}.${fieldKey}`;
    const isCurrentlyRecording =
      currentField?.key === fieldKey &&
      currentField?.category === category &&
      isRecording;

    return (
      <div key={fullFieldKey} className={`form-field ${isCurrentlyRecording ? 'recording-active' : ''}`}>
        <label htmlFor={fullFieldKey} className="form-label">
          {fieldConfig.label} {fieldConfig.required && "*"}
          {isCurrentlyRecording && <span className="recording-indicator"> 🎤 Recording...</span>}
        </label>
        <div className="field-input-container">
          <input
            type={fieldConfig.type}
            id={fullFieldKey}
            value={formData[fullFieldKey] || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [fullFieldKey]: e.target.value,
              }))
            }
            required={fieldConfig.required}
            className="form-input"
          />
          {!isAutoMode && (
            <button
              type="button"
              onClick={() =>
                isCurrentlyRecording
                  ? stopRecording()
                  : startRecordingForField(fieldKey, category)
              }
              className={`voice-button ${
                isCurrentlyRecording ? "recording" : ""
              }`}
              disabled={isRecording && !isCurrentlyRecording}>
              {isCurrentlyRecording ? "🔴 Stop" : "🎤 Voice"}
            </button>
          )}
        </div>
        {isCurrentlyRecording && (
          <p className="voice-prompt">{fieldConfig.prompt}</p>
        )}
        {processingStatus && isCurrentlyRecording && (
          <p className="processing-status">{processingStatus}</p>
        )}
        {fieldCompletionStatus && isCurrentlyRecording && (
          <p className="completion-status">{fieldCompletionStatus}</p>
        )}
      </div>
    );
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <DashboardPage
            apiCallCounter={apiCallCounter}
            formDataCount={Object.keys(formData).length}
          />
        );
      case "users":
        return <UsersPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "voice-settings":
        return <VoiceSettingsPage />;
      case "settings":
        return <SettingsPage />;
      case "kyc-forms":
      default:
        return (
          <div className="dashboard-content">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-icon">📝</span>
                  <span className="stat-card-title">Total Forms</span>
                </div>
                <div className="stat-card-value">1,247</div>
                <div className="stat-card-change positive">+12.5%</div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-icon">✅</span>
                  <span className="stat-card-title">Completed</span>
                </div>
                <div className="stat-card-value">1,089</div>
                <div className="stat-card-change positive">+8.2%</div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-icon">⏳</span>
                  <span className="stat-card-title">Pending</span>
                </div>
                <div className="stat-card-value">158</div>
                <div className="stat-card-change negative">-3.1%</div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-icon">🎤</span>
                  <span className="stat-card-title">Voice Input</span>
                </div>
                <div className="stat-card-value">
                  {isRecording ? "Active" : "Inactive"}
                </div>
                <div className="stat-card-change">
                  {isRecording ? "Recording" : "Ready"}
                </div>
              </div>
            </div>

            {/* KYC Form Widget */}
            <div className="form-widget">
              <div className="widget-header">
                <h2 className="widget-title">New KYC Application</h2>
                <div className="widget-actions">
                  <button className="btn-secondary">Templates</button>
                  <button className="btn-primary">Save Draft</button>
                </div>
              </div>

              <form className="kyc-form">
                {Object.entries(kycFields).map(([category, fields]) => (
                  <div key={category} className="form-section">
                    <div className="section-header">
                      <h3 className="section-title">
                        <span className="section-icon">
                          {category === "personalInfo" ? "👤" : "🏠"}
                        </span>
                        {category === "personalInfo"
                          ? "Personal Information"
                          : "Address Information"}
                      </h3>
                      <div className="section-progress">
                        <span className="progress-text">
                          {
                            Object.entries(fields).filter(
                              ([key]) => formData[`${category}.${key}`]
                            ).length
                          }
                          /{Object.entries(fields).length} completed
                        </span>
                      </div>
                    </div>

                    <div className="fields-grid">
                      {Object.entries(fields).map(([fieldKey, fieldConfig]) =>
                        renderFormField(fieldKey, fieldConfig, category)
                      )}
                    </div>
                  </div>
                ))}

                <div className="form-actions">
                  <div className="voice-controls">
                    {!isAutoMode && !isRecording && (
                      <button 
                        type="button" 
                        className="btn-voice-auto"
                        onClick={startAutoVoiceInput}
                      >
                        🎤 Start Auto Voice Input
                      </button>
                    )}
                    {isAutoMode && (
                      <button 
                        type="button" 
                        className="btn-voice-stop"
                        onClick={stopAutoVoiceInput}
                      >
                        🔴 Stop Auto Voice Input
                      </button>
                    )}
                    {fieldCompletionStatus && (
                      <div className="global-completion-status">
                        {fieldCompletionStatus}
                      </div>
                    )}
                  </div>
                  <div className="form-action-buttons">
                    <button type="button" className="btn-outline">
                      Save as Draft
                    </button>
                    <button type="submit" className="btn-submit">
                      Submit KYC Application
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Dashboard Overview";
      case "users":
        return "User Management";
      case "analytics":
        return "Analytics & Reports";
      case "voice-settings":
        return "Voice Input Settings";
      case "settings":
        return "System Settings";
      case "kyc-forms":
      default:
        return "KYC Form Management";
    }
  };

  const getBreadcrumb = () => {
    switch (currentPage) {
      case "dashboard":
        return "Dashboard";
      case "users":
        return "Users";
      case "analytics":
        return "Analytics";
      case "voice-settings":
        return "Voice Settings";
      case "settings":
        return "Settings";
      case "kyc-forms":
      default:
        return "KYC Forms";
    }
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">🎯</div>
            <span className="logo-text">KYC Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">Main</h3>
            <ul className="nav-menu">
              <li
                className={`nav-item ${
                  currentPage === "dashboard" ? "active" : ""
                }`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage("dashboard");
                  }}>
                  <span className="nav-icon">📊</span>
                  <span className="nav-text">Dashboard</span>
                </a>
              </li>
              <li
                className={`nav-item ${
                  currentPage === "kyc-forms" ? "active" : ""
                }`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage("kyc-forms");
                  }}>
                  <span className="nav-icon">📝</span>
                  <span className="nav-text">KYC Forms</span>
                </a>
              </li>
              <li
                className={`nav-item ${
                  currentPage === "users" ? "active" : ""
                }`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage("users");
                  }}>
                  <span className="nav-icon">👥</span>
                  <span className="nav-text">Users</span>
                </a>
              </li>
              <li
                className={`nav-item ${
                  currentPage === "analytics" ? "active" : ""
                }`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage("analytics");
                  }}>
                  <span className="nav-icon">📈</span>
                  <span className="nav-text">Analytics</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Tools</h3>
            <ul className="nav-menu">
              <li
                className={`nav-item ${
                  currentPage === "voice-settings" ? "active" : ""
                }`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage("voice-settings");
                  }}>
                  <span className="nav-icon">🎤</span>
                  <span className="nav-text">Voice Settings</span>
                </a>
              </li>
              <li
                className={`nav-item ${
                  currentPage === "settings" ? "active" : ""
                }`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage("settings");
                  }}>
                  <span className="nav-icon">⚙️</span>
                  <span className="nav-text">Settings</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">{getPageTitle()}</h1>
            <nav className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">{getBreadcrumb()}</span>
            </nav>
          </div>

          <div className="topbar-right">
            <div className="stats-quick">
              <div className="stat-item">
                <span className="stat-value">{apiCallCounter}</span>
                <span className="stat-label">API Calls</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {Object.keys(formData).length}
                </span>
                <span className="stat-label">Fields Filled</span>
              </div>
            </div>

            <div className="user-profile">
              <div className="user-avatar">👤</div>
              <div className="user-info">
                <span className="user-name">Admin User</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        {renderCurrentPage()}
      </main>

      {isListening && (
        <div className="listening-indicator">
          <div className="listening-content">
            <div className="listening-icon">🎤</div>
            <div className="listening-text">
              <span className="listening-title">Voice Input Active</span>
              <span className="listening-subtitle">
                Speak clearly for better recognition
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
