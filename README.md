# 🎙️ MeetingNotes

MeetingNotes is a mobile application built with **React Native (Expo)** that allows users to **record meetings**, **organize recordings into groups**, and **save structured metadata** such as meeting names and categories.  
The application emphasizes a **smooth recording experience**, **clean UI**, and **thoughtful UX interactions**.

---

## ✨ Features

- 🎤 Audio recording using **Expo Audio API**
- ⏸️ Pause and resume recording
- 🛑 Stop recording with save confirmation modal
- 🗂️ Group-based organization of meetings
- ➕ Create new groups dynamically
- 🔍 Searchable group dropdown
- 🎬 Animated waveform using **Lottie**
- 🎨 Smooth UI transitions and modal animations
- ⚠️ Input validation before saving
- ❌ Safe exit with discard confirmation

---

## 📱 User Flow

1. User taps **“Tap to record”**
2. Recording screen appears with animated waveform
3. User can:
   - Pause / resume recording
   - Exit and discard recording
   - Stop recording
4. On **Stop**, a **Save Meeting modal** appears:
   - Enter meeting name
   - Select or create a group
5. Recording is finalized **only after clicking Save**

---

## 🧩 Tech Stack

- React Native
- Expo
- Expo AV (Audio Recording)
- Lottie (Waveform Animation)
- Animated API (Transitions)
- TypeScript

---


## 🗃️ Data Model (Planned)

The application is designed to store recordings with metadata:

### Meeting
- id
- name
- audioFilePath
- duration
- createdAt
- groupId

### Group
- id
- name

(Database implementation planned using SQLite or local storage.)

---

## 🚀 Running the Project

```bash
npm install
npx expo start

---
## 🛠️ Future Improvements
- Persistent storage using SQLite
- Playback screen for saved recordings
- Meeting transcription and summaries
- Cloud sync and backup
- Analytics and meeting history

---
## 👤 Author
Daniel Ngounou Ngounou
Software Engineering Student
UI/UX Designer & Mobile Developer

