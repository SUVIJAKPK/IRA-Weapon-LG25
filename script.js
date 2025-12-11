// รหัสลับที่ถูกต้อง
const CORRECT_CODE = "TEAMWORK"; 
const CODE_LENGTH = 8;

// **********************************************
// 1. รับองค์ประกอบจาก HTML
// **********************************************
const codeInput = document.getElementById('codeInput');
const checkButton = document.getElementById('checkButton');
const messageDisplay = document.getElementById('message-display');
const systemInterface = document.querySelector('.system-interface');

// สำหรับเอฟเฟกต์ ดาบ และ เสียง 
const swordContainer = document.getElementById('sword-effect-container');
// *** สำคัญ: ต้องอ้างถึง leftSword และ rightSword เพื่อให้ CSS ไขว้กันได้ ***
const leftSword = document.getElementById('left-sword');
const rightSword = document.getElementById('right-sword'); 
const fireworksSound = document.getElementById('fireworks-audio'); 

// เตรียม Confetti (พลุ)
let jsConfetti;
try {
    jsConfetti = new JSConfetti({
        canvas: document.getElementById('fireworks-canvas')
    });
} catch (e) {
    console.error("Confetti initialization failed. The JSConfetti library might not be fully loaded or defined.", e);
    jsConfetti = { addConfetti: () => console.log("Confetti library is not available.") };
}


// ฟังก์ชันสำหรับแสดงข้อความผลลัพธ์
function displayMessage(message, isCorrect) {
    messageDisplay.innerHTML = `<p>${message}</p>`;
    messageDisplay.className = 'display-box'; 
    
    if (isCorrect) {
        messageDisplay.classList.add('success');
    } else {
        messageDisplay.classList.add('error');
    }
}

// ฟังก์ชันสำหรับเล่นเสียงอย่างปลอดภัย (จัดการ Autoplay Policy)
function playAudioSafe() {
    if (fireworksSound) {
        fireworksSound.currentTime = 0;
        const playPromise = fireworksSound.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Audio playback started successfully.");
            }).catch(error => {
                // หากถูกบล็อก ให้แสดงคำเตือน
                console.warn("Audio playback was blocked. Error:", error);
            });
        }
    }
}


// ฟังก์ชันสำหรับเล่นเอฟเฟกต์ทั้งหมดเมื่อตอบถูก
function playSuccessEffects() {
    // 1. เอฟเฟกต์เรืองแสงของกรอบ
    systemInterface.classList.add('success-effect');

    // 2. เอฟเฟกต์ดาบไขว้
    swordContainer.classList.add('active'); 
    // ตรวจสอบว่ามี element ของดาบอยู่จริงก่อนเรียกใช้ animation
    if (leftSword && rightSword) {
        leftSword.style.animation = '';
        rightSword.style.animation = '';
        void leftSword.offsetWidth;
        void rightSword.offsetWidth;
        leftSword.style.animation = 'sword-left-animation 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        rightSword.style.animation = 'sword-right-animation 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
    }

    // 3. เล่นเสียงพลุ (เรียกฟังก์ชันที่ปรับปรุงใหม่)
    playAudioSafe();

    // 4. เอฟเฟกต์พลุแบบเวอร์ๆ
    jsConfetti.addConfetti({
        emojis: ['🎉', '✨', '⚡️', '🚀', '🌟', '💥', '💫'],
        confettiRadius: 6,
        confettiNumber: 500,
        emojiSize: 80,
    });
    
    jsConfetti.addConfetti({
        confettiColors: [
            '#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7',
            '#00ff41', '#00e0ff', '#ffff00', '#5d9cec'
        ],
        confettiRadius: 8,
        confettiNumber: 800
    });

    // ตั้งเวลาลบคลาสและหยุดเอฟเฟกต์หลังจาก 3 วินาที
    setTimeout(() => {
        systemInterface.classList.remove('success-effect');
        swordContainer.classList.remove('active');
    }, 3000); 
}

// **********************************
// 2. ฟังก์ชันหลักสำหรับตรวจสอบรหัส
// **********************************
function checkCode() {
    const enteredCode = codeInput.value.toUpperCase(); 

    if (enteredCode.length !== CODE_LENGTH) {
        displayMessage(`🚨 ERROR: CODE LENGTH MISMATCH! (${enteredCode.length}/${CODE_LENGTH})`, false);
        return; 
    } 
    
    if (enteredCode === CORRECT_CODE) {
        displayMessage("✅ ACTIVATION SUCCESSFUL! IRA WEAPON READY.", true);
        playSuccessEffects(); 
    } else {
        displayMessage("❌ EXECUTION FAILED! ACCESS DENIED.", false);
    }
    
    codeInput.value = "";
    codeInput.focus();
}

// ******************************
// 3. ผูกฟังก์ชันเข้ากับ Element
// ******************************
document.addEventListener('DOMContentLoaded', () => {
    if (checkButton) {
        checkButton.addEventListener('click', checkCode);
    } 

    if (codeInput) {
        codeInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                checkCode(); 
            }
        });
    }

    if (codeInput) {
        codeInput.focus();
    }
});