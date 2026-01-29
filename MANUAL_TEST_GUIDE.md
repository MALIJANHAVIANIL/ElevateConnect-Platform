# 🚀 Quick Start Guide - ElevateConnect

## ✅ Backend Status: RUNNING

Your backend server is **currently running** on `http://localhost:8081`

---

## 📝 Manual Testing Instructions

Since the automated browser is unavailable, please follow these steps:

### Step 1: Open Test Page in Your Browser

**Copy and paste this path** into your browser address bar (Chrome, Edge, Firefox):

```
file:///C:/Users/Lenovo/Downloads/ElevateConnect/frontend/test-api.html
```

OR

**Navigate manually:**
1. Open File Explorer
2. Go to: `C:\Users\Lenovo\Downloads\ElevateConnect\frontend\`
3. **Double-click** `test-api.html`

---

### Step 2: Test Registration API

1. Click the **"Test Registration API"** button
2. **Expected Result**: You should see output like:
   ```json
   Registration Response (200):
   {
     "token": "eyJhbGc...",
     "role": "STUDENT"
   }
   ```

3. **If you get an error**, press **F12** to open Developer Console and check for CORS errors

---

### Step 3: Test Login API

1. Click the **"Test Login API"** button  
2. **Expected Result**: 
   ```json
   Login Response (200):
   {
     "token": "eyJhbGc...",
     "role": "STUDENT"
   }
   ```

---

## 🎯 Full System Test

After verifying the test page works, try the **complete registration flow**:

**Open in browser:**
```
file:///C:/Users/Lenovo/Downloads/ElevateConnect/frontend/register.html
```

**Create a student account:**
- Email: `student@college.edu`
- Password: `student123`
- Name: `John Doe`
- Phone: `8888888888`
- Role: **STUDENT**
- Branch: `Computer Science`
- CGPA: `8.5`
- Skills: `Java, Python`

**Then login** and explore the student dashboard!

---

## ⚠️ Troubleshooting

### If you see CORS errors in browser console:

This means the frontend can't connect to the backend. The backend security configuration may need adjustment.

**Please share:**
1. The exact error message from browser console (F12)
2. Screenshot of the error if possible

### If backend stopped:

Restart with:
```powershell
cd C:\Users\Lenovo\Downloads\ElevateConnect\backend
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
cmd /c "C:\Users\Lenovo\.m2\wrapper\dists\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run"
```

---

## 📊 What to Report Back

After testing, please let me know:

✅ **Did registration work?** (200 status + token received)  
✅ **Did login work?** (200 status + token received)  
✅ **Any errors?** (Share console messages)

This will help me verify the complete system integrity!
