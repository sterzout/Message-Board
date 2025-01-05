function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    let timeSide = "AM";
    if (hours >= 12){
        timeSide = "PM";
        if (hours > 12 ){
            hours = hours % 12;
        }
    }
    if (hours === 0){
        hours = 12;
    }    
    const timeString = `CLOCK : ${hours}:${minutes}:${seconds} ${timeSide}`;
    clockElement.textContent = timeString;

}

updateClock();
setInterval(updateClock, 1000);
