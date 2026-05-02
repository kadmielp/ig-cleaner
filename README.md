# IG Cleaner

IG Cleaner is a lightweight, in-browser tool that helps you identify non-mutual follows on Instagram and review them with full control.

---

## ✨ Features

- 🔍 Detect non-mutual follows (people you follow who don’t follow back)
- 📊 Live progress tracking while scanning
- ✅ Select, filter, and review users
- 🔎 Search within results
- 🌐 Open selected profiles in new tabs
- 📋 Copy selected usernames or full list
- ⚡ Runs directly in your browser (no install)

---

## 🚀 How to Use

1. Go to your Instagram profile  
   Example: `https://www.instagram.com/your_username/`

2. Open Developer Tools  
   - Chrome / Edge: `F12` or `Ctrl + Shift + I`  
   - Mac: `Cmd + Option + I`

3. Go to the **Console** tab

4. Paste the IG Cleaner script and press **Enter**

5. Click **Scan** inside the UI

---

## 🧠 How It Works

- Opens your **Following** list and collects all usernames  
- Opens your **Followers** list and collects all usernames  
- Compares both lists  
- Returns users that **you follow but don’t follow you back**

---

## ⚠️ Safety & Limitations

- ❗ No automatic unfollowing (by design)  
- ❗ Avoid opening too many profiles at once (rate limits)  
- ❗ Instagram may change its UI and break selectors  
- ❗ Large accounts may take longer to scan  

This tool is designed for **manual review and safe usage**, not automation abuse.

---

## 💡 Best Practice Workflow

```

Scan → Filter → Select → Open Profiles → Decide → Unfollow manually

```

Think of it as a **decision dashboard**, not a bot.

---

## 🛠 Tech Notes

- Vanilla JavaScript  
- Runs fully client-side  
- Uses DOM scraping from Instagram modals  
- No API usage  
- No data storage  

---

## 🔮 Future Ideas

- Chrome Extension version
- Export to CSV / JSON file
- Detect inactive or ghost accounts

---

## ⚖️ Disclaimer

This project is not affiliated with Instagram.

By using this tool, you acknowledge that you do so at your own risk.  
The author is **not responsible for any consequences**, including but not limited to account restrictions, rate limits, data issues, or any other impact resulting from its use.

---

## 👤 Author

Built as a practical tool for analyzing and managing social connections with clarity and control.
