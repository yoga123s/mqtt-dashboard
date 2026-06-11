const socket = io();

window.onload = () => {

    let voltageData = [];
    let currentData = [];
    let powerData = [];
    let labels = [];

    let timeout;

    const ctx = document.getElementById('trendChart').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Voltage', data: voltageData, borderColor: 'red', tension: 0.3 },
                { label: 'Current', data: currentData, borderColor: 'yellow', tension: 0.3 },
                { label: 'Power', data: powerData, borderColor: 'cyan', tension: 0.3 }
            ]
        },
        options: {
            responsive: true,
            animation: false
        }
    });

    function setOnline() {
        const status = document.getElementById("status");
        status.innerHTML = "🟢 ONLINE";
        status.className = "online";
    }

    function setOffline() {
        const status = document.getElementById("status");
        status.innerHTML = "🔴 OFFLINE";
        status.className = "offline";
    }

socket.on("mqtt-data", (data) => {

    const value = parseFloat(data.value);

    // ===== STATUS ONLINE =====
    setOnline();

    clearTimeout(timeout);

    timeout = setTimeout(() => {
        setOffline();
    }, 5000);

    // ===== LAST UPDATE =====
    document.getElementById("lastUpdate").innerHTML =
        new Date().toLocaleString();

    // ===== SIMPAN LAST VALUE =====
    if (data.topic.includes("voltage")) {
        window.v = value;
        document.getElementById("voltage").innerHTML = value;
    }

    if (data.topic.includes("current")) {
        window.c = value;
        document.getElementById("current").innerHTML = value;
    }

    if (data.topic.includes("power")) {
        window.p = value;
        document.getElementById("power").innerHTML = value;
    }

    // ===== CHART UPDATE (HANYA JIKA LENGKAP) =====
    if (window.v !== undefined &&
        window.c !== undefined &&
        window.p !== undefined) {

        const time = new Date().toLocaleTimeString();

        labels.push(time);
        voltageData.push(window.v);
        currentData.push(window.c);
        powerData.push(window.p);

        // SLIDING WINDOW STABIL
        if (labels.length > 20) {
            labels.shift();
            voltageData.shift();
            currentData.shift();
            powerData.shift();
        }

        chart.update();
    }

});

    // ===== SAFETY: kalau socket mati (web tidak connect server) =====
    socket.on("disconnect", () => {
        setOffline();
    });

};