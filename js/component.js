// Kiểm tra xem người dùng đã đăng nhập chưa
if (!localStorage.getItem('loggedIn')) {
    window.location.href = '/login.html'; 
}

window.onload = function() {
    const loggedIn = localStorage.getItem('loggedIn');
    
    if (!loggedIn) {
        // Nếu chưa đăng nhập, chuyển hướng người dùng đến trang đăng nhập
        window.location.href = '/login.html';
    }
};
// Fetch weather data from WeatherAPI
async function fetchWeatherData() {
    const apiUrl = "http://api.weatherapi.com/v1/forecast.json?key=7617f9f7ffa6403c8c603928242709&q=Hanoi&days=1";
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        displayWeatherData(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Display weather data
function displayWeatherData(data) {
    const weatherDiv = document.getElementById('weather');
    weatherDiv.innerHTML = ''; // Clear previous data
    
    const currentTemp = data.current.temp_c;
    const humidity = data.current.humidity;
    const forecast = data.forecast.forecastday[0].day;
    const rainfall = forecast.totalprecip_mm;  // Lượng mưa
    const chanceOfRain = forecast.daily_chance_of_rain;  // Khả năng mưa (%)

    // Create weather cards
    const weatherData = [
        { icon: 'fas fa-temperature-high', label: `Nhiệt độ`, value: `${currentTemp} °C` },
        { icon: 'fas fa-water', label: `Độ ẩm`, value: `${humidity} %` },
        { icon: 'fas fa-cloud-showers-heavy', label: `Lượng mưa`, value: `${rainfall} mm` },
        { icon: 'fas fa-umbrella', label: `Khả năng có mưa`, value: `${chanceOfRain} %` }
    ];

    weatherData.forEach(item => {
        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';
        weatherCard.innerHTML = `
            <i class="${item.icon}"></i>
            <h3>${item.label}</h3>
            <p>${item.value}</p>
        `;
        weatherDiv.appendChild(weatherCard);
    });
}

// Fetch humidity data from ThinkSpeak
async function fetchHumidityData() {
    const thinkSpeakApiUrl = "http://api.thingspeak.com/channels/2674054/feeds.json?api_key=7UN1PZEEFOM2V5RX&results=10";
    
    try {
        const response = await fetch(thinkSpeakApiUrl);
        const data = await response.json();
        displayHumidityTable(data);
    } catch (error) {
        console.error("Error fetching humidity data:", error);
    }
}

// Display humidity data in a table
function displayHumidityTable(data) {
    const humidityDiv = document.getElementById('humidity');
    humidityDiv.innerHTML = ''; // Clear previous data

    // Create table elements
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Set table headers
    const headers = ['Time', 'Soil Humidity (%)'];
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Populate table rows with data
    data.feeds.forEach(feed => {
        const row = document.createElement('tr');
        
        // Time (feed.created_at) and Soil Humidity (feed.field1)
        const timeCell = document.createElement('td');
        const humidityCell = document.createElement('td');
        
        timeCell.textContent = new Date(feed.created_at).toLocaleString(); // Format time
        humidityCell.textContent = feed.field1 ? `${feed.field1} %` : 'N/A';  // Display field1 as humidity data

        row.appendChild(timeCell);
        row.appendChild(humidityCell);
        
        tbody.appendChild(row);
    });

    // Append thead and tbody to the table
    table.appendChild(thead);
    table.appendChild(tbody);
    
    // Append table to the humidityDiv
    humidityDiv.appendChild(table);
}

window.onload = function() {
    fetchWeatherData(); // Fetch weather data when the page loads
    fetchHumidityData(); // Fetch humidity data when the page loads
};
// Fetch pump status data from API
async function fetchPumpStatusData() {
    try {
        const response = await fetch('http://192.168.1.114:3000/auto/');

        if (response.ok) {
            const data = await response.json();
            
            // Giới hạn chỉ lấy 10 bản ghi gần nhất
            const latestData = data.slice(-10).reverse(); // Lấy 10 bản ghi cuối cùng và đảo ngược thứ tự

            displayPumpStatusTable(latestData);
            console.log(latestData);
        } else {
            document.getElementById('dataDisplay').innerText = "Lỗi khi lấy dữ liệu. Vui lòng thử lại.";
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        document.getElementById('dataDisplay').innerText = "Lỗi kết nối. Vui lòng thử lại.";
    }
}

// Display pump status data in a table
function displayPumpStatusTable(data) {
    const pumpStatusDiv = document.getElementById('pump-status');
    pumpStatusDiv.innerHTML = ''; // Clear previous data

    // Create table elements
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Set table headers
    const headers = ['Time', 'Pump Status'];
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Populate table rows with data
    data.forEach(data => {
        const row = document.createElement('tr');
        
        // Time (feed.created_at) and Pump Status (feed.field2)
        const timeCell = document.createElement('td');
        const statusCell = document.createElement('td');
        
        timeCell.textContent = new Date(data.createdAt).toLocaleString(); // Format time
        const pumpStatus = data.status === "1" ? "Pump ON" : "Pump OFF";  // Check pump status
        statusCell.textContent = pumpStatus;

        row.appendChild(timeCell);
        row.appendChild(statusCell);
        
        tbody.appendChild(row);
    });

    // Append thead and tbody to the table
    table.appendChild(thead);
    table.appendChild(tbody);
    
    // Append table to the pumpStatusDiv
    pumpStatusDiv.appendChild(table);
}



// Fetch data from ThinkSpeak API
async function fetchSensorDataHumidity() {
    const thinkSpeakApiUrl = "http://api.thingspeak.com/channels/2674054/feeds.json?api_key=7UN1PZEEFOM2V5RX&results=1";
    const statusUrl = "http://192.168.1.114:3000/auto";
    const pumpControlApiUrl = "http://192.168.1.114:3000/alert/sendMail";
    try {
        const response = await fetch(thinkSpeakApiUrl);
        const data = await response.json();

        const statusResponse = await fetch(statusUrl);
        const status = await statusResponse.json();
        status.reverse();
        const latestRecord = status[0]; 

        const humidity = parseFloat(data.feeds[0].field1); // Assuming humidity is in field1
        displayHumidity(data.feeds[0].field1); //

        if (humidity < 80 && latestRecord.status == "0") {
            alert(`Độ ẩm hiện tại là ${humidity}%, bạn nên bật máy bơm!`);
            await fetch(pumpControlApiUrl);
        }

    } catch (error) {
        console.error("Error fetching sensor data:", error);
    }
    
}

async function fetchSensorDataStatus() {
    const thinkSpeakApiUrl = "http://192.168.1.114:3000/auto";

    try {
        const response = await fetch(thinkSpeakApiUrl);
        const data = await response.json();
        
        if (data.length > 0) {
            data.reverse();
            const latestRecord = data[0]; 
            displayPumpStatus(latestRecord.status);
        } else {
            console.error("Không có dữ liệu.");
        }
    } catch (error) {
        console.error("Error fetching sensor data:", error);
    }
}

function displayPumpStatus(pumpStatus) {
    const pumpCard = document.getElementById('pump-card');
    const statusText = pumpStatus === "1" ? "Đang bật" : "Đang tắt";
    const statusClass = pumpStatus === "1" ? "pump-on" : "pump-off";
    const pumpIcon = pumpStatus === "1" ? "fas fa-toggle-on" : "fas fa-toggle-off";

    pumpCard.innerHTML = `
        <i class="${pumpIcon}"></i>
        <h3>Máy bơm</h3>
        <p class="${statusClass}">${statusText}</p>
    `;
}

// Display humidity data in the humidity card
function displayHumidity(humidity) {
    const humidityCard = document.getElementById('humidity-card');
    humidityCard.innerHTML = `
        <i class="fas fa-tint"></i>
        <h3>Độ ẩm</h3>
        <p>${humidity ? humidity + " %" : "N/A"}</p>
    `;
}

// Display pump status in the pump card



async function fetchTime() {
    try {
        const response = await fetch('http://192.168.1.114:3000/time/');

        if (response.ok) {
            const data = await response.json();
            displayData(data);
        } else {
            document.getElementById('dataDisplay').innerText = "Lỗi khi lấy dữ liệu. Vui lòng thử lại.";
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        document.getElementById('dataDisplay').innerText = "Lỗi kết nối. Vui lòng thử lại.";
    }
}

function displayData(data) {
    const displayDiv = document.getElementById('dataDisplay');
    displayDiv.innerHTML = ''; // Xóa nội dung cũ

    if (Array.isArray(data)) {
        data.forEach(item => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('time-entry');

            const timeText = document.createElement('span');
            timeText.innerText = `Thời gian: ${item.time}`; // Hiển thị thời gian

            const editButton = document.createElement('button');
            editButton.innerText = "Sửa";
            editButton.classList.add('edit-button');
            editButton.classList.add('delete-button');
            editButton.onclick = function() {
                editTime(item.id, item.time); // Gọi hàm chỉnh sửa với id và thời gian hiện tại
            };

            const deleteButton = document.createElement('button');
            deleteButton.innerText = "Xóa";
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = function() {
                deleteTime(item.id); // Gọi hàm xóa với id tương ứng
            };

            entryDiv.appendChild(timeText);
            entryDiv.appendChild(editButton);
            entryDiv.appendChild(deleteButton);
            displayDiv.appendChild(entryDiv);
        });
    } else {
        displayDiv.innerText = "Dữ liệu không hợp lệ.";
    }
}

async function editTime(id, currentTime) {
    const newTime = prompt("Nhập thời gian mới (định dạng HH:mm)", currentTime);
    const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/; // Kiểm tra định dạng thời gian 24h

    if (newTime && regex.test(newTime)) {
        try {
            const response = await fetch(`http://192.168.1.114:3000/time/edit/${id}`, {
                method: 'PATCH',
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({ id, time: newTime })
            });

            if (response.ok) {
                fetchTime(); // Cập nhật lại danh sách sau khi chỉnh sửa
            } else {
                alert("Không thể chỉnh sửa thời gian.");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Lỗi kết nối khi chỉnh sửa dữ liệu.");
        }
    } else {
        alert("Thời gian không hợp lệ. Vui lòng nhập lại.");
    }
}

async function deleteTime(id) {
    try {
        // Gửi yêu cầu xóa tới API với id tương ứng
        const response = await fetch(`http://192.168.1.114:3000/time/delete/${id}`, {
            method: 'DELETE'
        });

        console.log("Mã phản hồi:", response.status); // In mã trạng thái
        const responseData = await response.json(); // Nhận dữ liệu phản hồi
        console.log("Dữ liệu phản hồi:", responseData); // In dữ liệu phản hồi

        if (response.ok) {
            // Cập nhật lại dữ liệu sau khi xóa thành công
            fetchTime();
        } else {
            alert("Không thể xóa thời gian: " + responseData.message || "Lỗi không xác định.");
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        alert("Lỗi kết nối khi xóa dữ liệu.");
    }
}

window.onload = function() {
    fetchWeatherData(); // Fetch weather data when the page loads
    fetchHumidityData(); // Fetch humidity data when the page loads
    fetchPumpStatusData(); // Fetch pump status data when the page loads
    fetchSensorDataHumidity();
    fetchSensorDataStatus();
    fetchTime();
};


function logout() {
    // Xử lý logic đăng xuất (ví dụ: xóa token, chuyển hướng đến trang đăng nhập, v.v.)
    alert('Bạn đã đăng xuất thành công!');
        localStorage.removeItem('loggedIn'); // Clear the login state
        window.location.href = '/login.html'; // Redirect to the login page
    
    
}