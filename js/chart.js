
// URL của API
const apiUrl = "http://api.thingspeak.com/channels/2674054/feeds.json?api_key=7UN1PZEEFOM2V5RX&results=10";

// Lấy dữ liệu từ API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Trích xuất dữ liệu độ ẩm và thời gian
        const humidityValues = data.feeds.map(feed => feed.field1);
        const timestamps = data.feeds.map(feed => new Date(feed.created_at).toLocaleString());

        // Thiết lập biểu đồ
        const ctx = document.getElementById('humidityChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line', // Loại biểu đồ đường
            data: {
                labels: timestamps, // Trục X là thời gian
                datasets: [{
                    label: 'Humidity (%)',
                    data: humidityValues, // Trục Y là độ ẩm
                    borderColor: 'blue',
                    fill: false,
                    borderWidth: 2,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));

