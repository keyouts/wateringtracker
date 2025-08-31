   const calendarEl = document.getElementById('calendar');
    const plantSelector = document.getElementById('plantSelector');
    const plantTitle = document.getElementById('plantTitle');

    let plants = JSON.parse(localStorage.getItem('plants')) || {};
    let currentPlant = null;

    function savePlants() {
      localStorage.setItem('plants', JSON.stringify(plants));
    }

    function addPlant() {
      const name = document.getElementById('plantName').value.trim();
      const schedule = document.getElementById('schedule').value;
      if (!name || plants[name]) return;

      plants[name] = {
        schedule,
        wateredDays: []
      };
      savePlants();
      updateSelector();
      plantSelector.value = name;
      loadPlant();
    }

    function deletePlant() {
      if (!currentPlant) return;
      delete plants[currentPlant];
      savePlants();
      updateSelector();

      const remaining = Object.keys(plants);
      if (remaining.length > 0) {
        currentPlant = remaining[0];
        plantSelector.value = currentPlant;
        loadPlant();
      } else {
        currentPlant = null;
        plantTitle.innerText = '';
        calendarEl.innerHTML = '';
      }
    }

    function updateSelector() {
      plantSelector.innerHTML = '';
      Object.keys(plants).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.text = name;
        plantSelector.appendChild(option);
      });
    }

    function loadPlant() {
      currentPlant = plantSelector.value;
      if (!currentPlant) return;
      plantTitle.innerText = `${currentPlant} – ${plants[currentPlant].schedule}`;
      renderCalendar();
    }

    function renderCalendar() {
      calendarEl.innerHTML = '';
      const today = new Date();

      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const day = document.createElement('div');
        day.className = 'day';

        const options = { month: 'short', day: 'numeric' };
        day.innerText = date.toLocaleDateString('en-US', options); // e.g., "Sep 01"

        if (plants[currentPlant].wateredDays.includes(dateStr)) {
          day.classList.add('watered');
        }

        day.onclick = () => {
          const days = plants[currentPlant].wateredDays;
          if (days.includes(dateStr)) {
            plants[currentPlant].wateredDays = days.filter(d => d !== dateStr);
          } else {
            days.push(dateStr);
          }
          savePlants();
          renderCalendar();
        };

        calendarEl.appendChild(day);
      }
    }

    updateSelector();
    if (plantSelector.value) {
      loadPlant();
  }