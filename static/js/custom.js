const liveText = document.querySelector('#liveText');
let liveTexts;
let liveIndex =0;
// 계속 바뀌기
async function downloadLiveText() {
    liveTexts = await fetch(`/location?locationName=*`, {method:'GET', headers:{
        'Content-Type': 'application/json'
    }})
    .then(response => response.json())
    .then(data => {
        // 데이터의 마지막 5개 항목 중에서 랜덤하게 하나를 선택
        return data.slice(-10);
    });
}

async function updateLiveText() {
    if (liveIndex >=10) {liveIndex = 0;}

    const selectedText = liveTexts[liveIndex]['text'];
        // liveText 요소의 텍스트를 업데이트
    liveText.textContent = selectedText;
    liveText.style.opacity = 0;

    // 잠시 후에 텍스트를 업데이트하고 opacity를 다시 1로 변경합니다.
    setTimeout(() => {
        liveText.textContent = selectedText;
        liveText.style.opacity = 1;
    }, 500); // CSS transition 시간과 일치시키세요.
    liveIndex += 1;

    await fetchData(savedLocation, false);
}
// setInterval(fetchData(savedLocation), 60000);
downloadLiveText();
setInterval(updateLiveText, 8000);
setInterval(downloadLiveText, 60000);
let chats = document.getElementById('chats');

let savedLocation = "Wangsimni";
let savedUserName = localStorage.getItem('user_name');

const share = document.getElementById('share-btn');
share.addEventListener('click', function(e) {
    e.preventDefault(); // 기본 이벤트를 방지합니다.
    
    // 현재 페이지의 URL을 가져옵니다.
    const pageUrl = window.location.href;
    
    // 클립보드 API를 사용하여 URL을 클립보드에 복사합니다.
    navigator.clipboard.writeText(pageUrl).then(function() {
        // 성공적으로 복사되었을 때 실행될 코드
        alert('링크가 클립보드에 복사되었습니다.');
    }, function(err) {
        // 복사에 실패했을 때 실행될 코드
        console.error('링크 복사에 실패했습니다.', err);
    });
});

let subway = document.querySelectorAll('#subwayLocation .subway');
for (let i=0; i<subway.length;i++) {
    subway[i].addEventListener('click', function(e) {
        e.preventDefault();
        const chatTitle = document.querySelector('#chat-area #chat-title');
        chatTitle.textContent = `${this.textContent.trim()}톡`;
        document.querySelectorAll('.subway').forEach(item =>{
            item.classList.remove('subway-green-active', 'subway-blue-active', 'subway-red-active','subway-cyan-active');
        });

        if (this.classList.contains('subway-green')) {
            this.classList.add('subway-green-active');
        }
        else if (this.classList.contains('subway-blue')) {
            this.classList.add('subway-blue-active');
        }
        else if (this.classList.contains('subway-red')) {
            this.classList.add('subway-red-active');
        }
        else if (this.classList.contains('subway-cyan')) {
            this.classList.add('subway-cyan-active');
        }

        
        fetchData(this.name);
        
    });
}

fetchData('Wangsimni');

if (savedUserName===null){
    savedUserName = generateUUID();
    localStorage.setItem('user_name', savedUserName);
}

const inputForm = document.querySelector('#input-form');
const textarea = inputForm.querySelector('#text-area');
const sendButton = inputForm.querySelector('#send-button');
const charCountElement = document.getElementById('char-count');
textarea.addEventListener('keypress', async function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { // shift 키를 누른 상태에서 엔터를 누르면 기본동작 수행
        e.preventDefault(); // 폼이 자동으로 제출되는 것을 막습니다.
        await fetch(`/post?text=${this.value}&userName=${savedUserName}&location=${savedLocation}`,
        {method:'POST'})
        await fetchData(savedLocation);
    }
});

sendButton.addEventListener('click', async function(e) {
    e.preventDefault();
    // postData(userName=savedUserName, text=textarea.value, location=savedLocation);
    await fetch(`/post?text=${textarea.value}&userName=${savedUserName}&location=${savedLocation}`,
        {method:'POST'})
        
    await fetchData(savedLocation);
})

textarea.addEventListener('input', () => {
    const charCount = textarea.value.length;
    charCountElement.textContent = `${charCount} / 100`;
});







function convertDate(isoDateString) {
        // Date 객체 생성
    const date = new Date(isoDateString);

    // YYYY-MM-DD HH:MM 형식으로 변환
    const formattedDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 16);

    return formattedDate;
}

async function fetchData(q, resetFlag=true) {
    savedLocation = q;
    let innerHTML = "";
    await fetch(`/location?locationName=${q}`, {method:'GET', headers:{
        'Content-Type': 'application/json'
    }})
    .then(response => response.json())
    .then(data => {
            // 요청이 성공적으로 처리되면, 사용자에게 알림을 띄웁니다.
            data.forEach(item => {
                innerHTML += 
                `<div class="border rounded-xl bg-slate-200 p-2">
                <div class="flex flex-row justify-start items-center gap-2">
                    <div class="text-md">${item["user_name"]}</div>
                    <div class="text-xs">${convertDate(item["created_at"])}</div>
                </div>
                <div class="text-lg text-left p-1">${item["text"]}</div>
            </div>`;
            });
            chats.innerHTML = innerHTML; 
        });
    
    // console.log(innerHTML);
    if (resetFlag===true){
        textarea.value = "";
        const charCount = textarea.value.length;
        charCountElement.textContent = `${charCount} / 100`;
        chats.scrollTop = chats.scrollHeight;
    }
    return ""
}


    

function generateUUID() {
    var uuid = '';
    var characters = '1234567ABCDEFGHKLMNOPRSTUVXYZ0123456789';
    for (var i = 0; i < 8; i++) {
        uuid += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return uuid;
}