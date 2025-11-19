const backendURL = "https://mainsofthelm.onrender.com";
const username = localStorage.getItem('softhelmUsername') || 'Initiate';
document.getElementById('username-display').innerText = `✶ ${username} ✶`;

// Define 10 categories with 10 traits each (placeholder names for now)
const categories = [
  "Hair","Eyes","Accessory","Clothing","Gloves",
  "Shoes","Hat","Mask","Weapon","Pet"
];

const traitsPerCategory = 10;
const traitsContainer = document.createElement('div');
traitsContainer.id = "traitsContainer";
document.body.appendChild(traitsContainer);

const selectedTraits = {};

// Build traits UI dynamically
categories.forEach(cat => {
  const catTitle = document.createElement('h3');
  catTitle.innerText = cat;
  traitsContainer.appendChild(catTitle);

  const catDiv = document.createElement('div');
  catDiv.className = 'trait-category';
  traitsContainer.appendChild(catDiv);

  for(let i=1; i<=traitsPerCategory; i++){
    const btn = document.createElement('button');
    btn.className = 'trait-btn';
    const name = `${cat} #${i}`;
    btn.dataset.category = cat;
    btn.dataset.name = name;
    btn.innerText = name;

    btn.onclick = () => {
      selectedTraits[cat] = name;

      // Deselect other buttons in the same category
      Array.from(catDiv.querySelectorAll('.trait-btn')).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    };

    catDiv.appendChild(btn);
  }
});

// Enter Realm button saves traits to server
document.getElementById('enterRealmBtn').onclick = async () => {
  try {
    const res = await fetch(`${backendURL}/saveTraits`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username, traits: selectedTraits })
    });
    const data = await res.json();
    if(data.success){
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Failed to save traits');
    }
  } catch(e) {
    alert('Server error while saving traits');
  }
};
