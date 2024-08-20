let newX = 0 , newY = 0 , startX = 0 , startY = 0
const chatWidgetMessage = document.querySelector('.message-part')
const textarea = document.getElementById('texting');
const menuToggle = document.querySelector('.menuToggle')
const cross = document.querySelector('.cross')
const container = document.querySelector('.container')
const download = document.querySelector('.download')
const rating = document.querySelector('.rating-box')
const ratingEmoji = document.querySelector('.rating')
const ratingBehind = document.querySelector('.rate-behind')
const minimize = document.querySelector('.minimize')
let clickedStar;
let bubbleDivGlobal;
// container.addEventListener('mousedown', mousedown)
// function mousedown(e){
//         startX = e.clientX;
//         startY = e.clientY;
//
//         document.addEventListener('mousemove', mouseMove)
//         document.addEventListener('mouseup', mouseUp)
// }
// function mouseMove(e){
//         newX = startX - e.clientX;
//         newY = startX - e.clientY;
//
//         startX= e.clientX
//         startY= e.clientY
//         console.log(startX)
//         console.log(startY)
//
//         container.style.top = (container.offsetTop - newY) + 'px'
//         container.style.left = (container.offsetLeft - newX) + 'px'
//
// }
// function mouseUp(e){
//         document.removeEventListener('mousemove', mouseMove)
// }
const iStars = document.querySelectorAll('.bx-star')
iStars.forEach((e,index)=> {
    e.addEventListener('mouseover', (e)=> {
        for (let i = 0 ; i<= index; i++ ){
            iStars[i].classList.add('goldStar')
        }
    })
    e.addEventListener('mouseout', (e)=> {
        iStars.forEach((e)=> {
            e.classList.remove('goldStar')
        })

    })
    e.addEventListener('click', (e)=>{

        iStars.forEach((s) => s.classList.remove("goldStarActive"));
                for (let i = 0; i <= index; i++) {
                    iStars[i].classList.add("goldStarActive");
                    clickedStar = index
                }
    })
})

download.addEventListener('click' ,downloadChatAsPDF)
document.addEventListener('DOMContentLoaded', function() {
            textarea.addEventListener('keydown', function(event){
                    if (event.key === 'Enter') {  // Check if the Enter key is pressed
                        event.preventDefault();  // Prevent newline
                        sendingMessage();  // Call the message-sending function
            }});  // Attach the keydown listener
        });
document.querySelector('.sending').addEventListener("click",  sendingMessage)

ratingEmoji.addEventListener('click', (e)=>{
    rating.style.display = 'block';
    ratingBehind.style.display = 'block'
})
minimize.addEventListener('click', (e)=>{
    rating.style.display = 'none'
    ratingBehind.style.display = 'none'
    ratingBehind.style.backgroundColor = "rgba(162,162,162,0.62)"
})
// Event listener for opening the menu
// menuToggle.addEventListener('click', () => {
//     container.style.display = 'block'; // Show the container
//     menuToggle.style.display = 'none'; // Hide the toggle button
// });
//
// // Event listener for closing the menu
// cross.addEventListener('click', () => {
//     container.style.display = 'none'; // Hide the container
//     menuToggle.style.display = 'block'; // Show the toggle button
// });
 cross.addEventListener('click', () => {
         console.log('I have been clicked')
         container.classList.toggle('active')
         // menuToggle.classList.toggle('active')

 });
 menuToggle.addEventListener('click', () => {
         console.log('I have been clicked')
         container.classList.toggle('active')
         // menuToggle.classList.toggle('active')

 });


async function sendingMessage(){
        console.log('I been clicked')
        const userMessage = document.getElementById('texting').value;
        if (userMessage === ''){
                return
        }

        creatingUserMessage(userMessage)
        autoScroll()
        creatingBubbleChat();
        autoScroll()
        const botResponse = await fetching(userMessage) ?? 'none'
        creatingBotMessage(botResponse)
        autoScroll()
}
function creatingBubbleChat(){
        const bubbleDiv = document.createElement('div')
        bubbleDiv.classList.add("typing-indicator")
        for (let i = 0 ; i < 3 ; i++){
                const span  =document.createElement('span')
                bubbleDiv.appendChild(span)
        }
        const botMessage  = document.createElement('div')
        const botImage = document.createElement('img')
        botImage.src = "../static/images/admin.png"
        botMessage.classList.add('message', 'bot');
        botMessage.appendChild(botImage)
        botMessage.appendChild(bubbleDiv)
        chatWidgetMessage.appendChild(botMessage)
        bubbleDivGlobal = botMessage
}
function creatingUserMessage(userMessage){
        document.querySelector('#texting').value = '';
        const newMessageDiv = document.createElement('div')
        const newMessage = document.createElement('p')
        newMessageDiv.classList.add('message', 'user')
        newMessage.innerHTML = `${userMessage}`
        const timerText = getTheTiming()
        newMessageDiv.appendChild(newMessage);
        newMessageDiv.appendChild(timerText)
        chatWidgetMessage.appendChild(newMessageDiv)
}
function creatingBotMessage(botResponse) {


        console.log(`Before : ${typeof botResponse}`)
        const newTextBox = document.createElement('div')
        const ResponseMessage = document.createElement('p')
         if (botResponse === 'none'){
                ResponseMessage.classList.add('error')
                ResponseMessage.innerText = 'Opps! Something went wrong. Please try again.'

        }
         let botResponse1
         try{
             botResponse1 = JSON.parse(botResponse)
         }catch(e){
             botResponse1 = botResponse
         }

         // print(`After :${botResponse1}`) // this line

        console.log(typeof botResponse1)
        console.log(`javascript${botResponse1}`)
        if (typeof botResponse1 === 'string'){
                console.log('This shit 1')
                ResponseMessage.innerText = botResponse1

        }else{
            console.log('This shit 2')
            botResponse1.forEach((e,i)=> {
                const type = Object.keys(e)[0]
                console.log(type)
                if (type === 'text'){
                    ResponseMessage.innerHTML += e['text']}
                 else if ( type  === 'question'){
                     ResponseMessage.innerHTML += `<br>${e['question']}</br>`
                    }
                 else if (type === 'ImgLink') {
                     ResponseMessage.innerHTML += `<br><img src="${e['ImgLink']}" class="outImage"><br>`;
                }
                else if (type === 'link'){
                    // Assuming e is an object with a 'link' property
                    ResponseMessage.innerHTML += `<br><a target="_blank" href="${e['link']}">${e['link']}</a><br>`;

                }
            })
        }

        const botImage = document.createElement('img')

        botImage.src = '../static/images/admin.png'
        newTextBox.classList.add('message', 'bot');

        const timerText = getTheTiming()
        newTextBox.appendChild(botImage)
        newTextBox.appendChild(ResponseMessage)
        newTextBox.appendChild(timerText)

        chatWidgetMessage.removeChild(bubbleDivGlobal)
        chatWidgetMessage.appendChild(newTextBox)
}

function autoScroll(){
        chatWidgetMessage.scrollTo({
                top: chatWidgetMessage.scrollHeight,
                behavior : 'smooth'
        })
}

async function fetching(userMessage){
        const requestConfig = {
                method : 'POST',
                headers : {
                        'Content-Type' : 'application/json'
                },
                body: JSON.stringify({'message' : userMessage})
        };
        try{

                const response = await fetch('/webhook', requestConfig)
                const data = await response.json()
                return  data.response


        }catch (error){
                console.error("Error", error)
        }

};

function getTheTiming(){
        const now = new Date()
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true // Optional, use `false` for 24-hour time
        });
        const timeTag = document.createElement('span')
        timeTag.innerText = timeString;
        return timeTag

}
function downloadChatAsPDF(){
        console.log('I am been clicked pdf')
        const {jsPDF} = window.jspdf;
        const pdf = new jsPDF();

        // Retrieve chat data from the chat container

        // const chatContainer = chatWidgetMessage.querySelectorAll('.message')
        // let yOffset = 20;
        // messages.forEach((e)=> {
        //         const message = e.querySelector('p').textContent
        //         const timing = e.querySelector('span').textContent
        //         pdf.text(`${message} ${timing}`, 10 , yOffset)
        //         yOffset += 10;
        // })
        // pdf.save('chat_history.pdf')
         // Use html2canvas to capture the chatbox as a canvas image
        html2canvas(chatWidgetMessage).then((canvas) => {
              const imgData = canvas.toDataURL('image/png'); // Get the canvas as a base64 image
              const pageWidth = pdf.internal.pageSize.width; // PDF page width

              // Insert the image into the PDF at the desired position
              pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, canvas.height * (pageWidth / canvas.width));

              // Download the PDF
                const pdfBlob = pdf.output("blob");
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl); // Open in a new tab
      })
}