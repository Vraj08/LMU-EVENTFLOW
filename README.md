
# 📅 LMU EventFlow

LMU EventFlow is a secure, role-based event management platform tailored for the Loyola Marymount University (LMU) community. Built by students to address real organizational challenges on campus, it streamlines the process of scheduling, approving, and managing events—while enabling live collaboration across departments like ITS, Sodexo, and Facilities.

## 🚀 Live Demo

> [LMU EventFlow (13-week project)](https://lmu-eventflow.vercel.app/)

---

## 📌 Features

- 🔐 **Secure Login** via LMU email + OTP verification (`@lmu.edu`, `@lion.lmu.edu`)
- 📆 **Event Scheduling & Approval Workflow** with real-time status updates
- 👥 **Role-Based Dashboards** for Students, Faculty, Admins, ITS, Sodexo, and more
- 💬 **Live Chat** for Resource Requests (tech, food, space, etc.)
- 📚 **Room Booking** tool for real-time availability and reservations
- 📲 **Responsive Design** with a personalized UI per user role

---

## 🎯 Project Goals

| Goal | Description |
|------|-------------|
| ✅ Centralized Scheduling | Avoid double bookings; one portal for all |
| ✅ Role-Specific Access | Personalized dashboards with permission logic |
| ✅ Integrated Resource Requests | Chat and coordinate with support departments |
| ✅ Real-Time Communication | Ensure event clarity and accountability |

---

## 🧩 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Redux Toolkit  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **Authentication**: OTP email via Nodemailer  
- **Deployment**: Vercel (frontend) & Render (backend)

---

## 📸 Screenshots
## 📸 Screenshots

![](screenshots/Screenshot%20%282%29.png)  
![](screenshots/Screenshot%20%283%29.png)  
![](screenshots/Screenshot%20%284%29.png)  
![](screenshots/Screenshot%20%285%29.png)  
![](screenshots/Screenshot%20%286%29.png)  
![](screenshots/Screenshot%20%287%29.png)  
![](screenshots/Screenshot%20%288%29.png)  
![](screenshots/Screenshot%20%289%29.png)  
![](screenshots/Screenshot%20%2810%29.png)  
![](screenshots/Screenshot%20%2811%29.png)  
![](screenshots/Screenshot%20%2812%29.png)  
![](screenshots/Screenshot%20%2813%29.png)  
![](screenshots/Screenshot%20%2814%29.png)  
![](screenshots/Screenshot%20%2815%29.png)  
![](screenshots/Screenshot%20%2816%29.png)  
![](screenshots/Screenshot%20%2817%29.png)  
![](screenshots/Screenshot%20%2818%29.png)  
![](screenshots/Screenshot%20%2819%29.png)  
![](screenshots/Screenshot%20%2820%29.png)  
![](screenshots/Screenshot%20%2821%29.png)  
![](screenshots/Screenshot%20%2822%29.png)  
![](screenshots/Screenshot%20%2823%29.png)  
![](screenshots/Screenshot%20%2824%29.png)  
![](screenshots/Screenshot%20%2825%29.png)  
![](screenshots/Screenshot%20%2826%29.png)  
![](screenshots/Screenshot%20%2827%29.png)  
![](screenshots/Screenshot%20%2828%29.png)  
![](screenshots/Screenshot%20%2829%29.png)  
![](screenshots/Screenshot%20%2830%29.png)  
![](screenshots/Screenshot%20%2831%29.png)  
![](screenshots/Screenshot%20%2832%29.png)  
![](screenshots/Screenshot%20%2833%29.png)  
![](screenshots/Screenshot%20%2834%29.png)  
![](screenshots/Screenshot%20%2835%29.png)  
![](screenshots/Screenshot%20%2836%29.png)  
![](screenshots/Screenshot%20%2837%29.png)  
![](screenshots/Screenshot%20%2838%29.png)  
![](screenshots/Screenshot%20%2839%29.png)  
![](screenshots/Screenshot%20%2840%29.png)  
![](screenshots/Screenshot%20%2841%29.png)  
![](screenshots/Screenshot%20%2842%29.png)  
![](screenshots/Screenshot%20%2843%29.png)

---

## 📈 Project Management

- **Methodology**: Agile Scrum – 13 weekly sprints
- **Tracking**: Jira + digitized Excel-based Scrum board
- **Charts**: 
  - 📊 Burnup: Tracked completed story points vs ideal trajectory
  - 📉 Burndown: Tracked remaining story points toward zero
- **Velocity**: ~20 story points per sprint (277 total)

| Sprint | Scrum Master | Total Tasks | Story Points | Key Highlights |
|--------|---------------|-------------|--------------|----------------|
| 1 | Vraj Patel | 7 | 17 | Repo setup, backend, DB schema |
| 2 | Divy Patel | 7 | 20 | Basic UI, login OTP |
| 3 | Jinil Patel | 6 | 18 | Dashboard by role |
| 4 | Jay Panchal | 6 | 15 | Event creation + data model |
| 5 | Ayush Prabhakar | 7 | 17 | Admin approval + event list |
| 6 | Vraj Patel | 7 | 23 | Chat system + ITS routing |
| 7 | Divy Patel | 8 | 28 | Room booking system |
| 8 | Jinil Patel | 8 | 20 | Role switch testing |
| 9 | Jay Panchal | 7 | 17 | RSVP + Event discovery |
| 10–13 | Team Rotation | 26 | 82 | Bug fixing, UI polish, final testing |

---

## 🔄 Challenges & Agile Responses

| Challenge | Agile Response |
|----------|----------------|
| Role-based UI complexity | Sprint backlog reprioritization after sprint review |
| Scope creep mid-sprint | Introduced Sprint Commitment Rule – no new tasks unless critical |
| Auto-approval risk | Adapted to admin approval based on test sprint feedback |
| Time constraints (midterms) | Flexible sprint velocity; shifted story point targets |

---

## 📊 Charts

| Chart | Description |
|-------|-------------|
| ![Burnup Chart](Burn-Up%20Chart.png) | Completed story points by sprint vs ideal |
| ![Burndown Chart](Burn-Down%20Chart.png) | Remaining story points to 0 by Sprint 13 |

---

## 📂 Folder Structure

```bash
LMU-EventFlow/
├── backend/
│   └── models/, routes/, controllers/
├── frontend/
│   └── components/, pages/, redux/
├── public/
├── .env
├── README.md
```

---

## 🙋‍♂️ Team

- **Vraj Patel** 
- **Divy Patel** 
- **Jinil Patel** 
- **Ayush Prabhakar** 
- **Jay Panchal** 

---

## 🏁 Final Outcome

✅ All critical features completed  
✅ 277 story points delivered over 13 sprints  
✅ Role-based security + resource workflows tested  
✅ Fully functional MVP deployed  
