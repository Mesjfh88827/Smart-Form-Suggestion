// small dataset for suggestions
const jobRoles = [
    "Front-End Developer", "React Developer", "UI Engineer", "Web Developer", "Frontend Intern",
    "Full-Stack Developer", "JavaScript Engineer", "Front-End Engineer"
];

const skillsList = [
    "HTML", "CSS", "JavaScript", "React", "Bootstrap", "Tailwind CSS", "Responsive Design", "Git"
];

    const cities = ["Cairo", "Alexandria", "Giza", "Aswan", "Mansoura", "Tanta", "Hurghada", "Luxor"];

// helpers
function fuzzySearch(list, q){
    q = (q||"").toLowerCase().trim();
    if(!q) return list.slice(0,5);
    return list.filter(item => item.toLowerCase().includes(q)).slice(0,5);
}

function makeChip(text, onClick){
    const d = document.createElement('div');
    d.className = 'chip';
    d.textContent = text;
    d.addEventListener('click', () => onClick(text));
    return d;
}

// DOM refs
const jobInput = document.getElementById('jobTitle');
const jobBox = document.getElementById('jobSuggestions');

const skillsInput = document.getElementById('skills');
const skillsBox = document.getElementById('skillsSuggestions');

const cityInput = document.getElementById('city');
const cityBox = document.getElementById('citySuggestions');

const smartBox = document.getElementById('smartBox');
const autoBtn = document.getElementById('autoSuggest');
const form = document.getElementById('demoForm');

// attach input listeners
jobInput.addEventListener('input', () => renderSuggestions(jobInput.value, jobRoles, jobBox, v => jobInput.value = v));
skillsInput.addEventListener('input', () => renderSuggestions(skillsInput.value, skillsList, skillsBox, v => {
  // for skills allow comma separated multi-select
    const current = skillsInput.value.split(',').map(s=>s.trim()).filter(Boolean);
    if(!current.includes(v)) current.push(v);
    skillsInput.value = current.join(', ');
}));
cityInput.addEventListener('input', () => renderSuggestions(cityInput.value, cities, cityBox, v => cityInput.value = v));

// render suggestions function
function renderSuggestions(query, list, box, onClick){
    box.innerHTML = '';
    const results = fuzzySearch(list, query);
    results.forEach(r => box.appendChild(makeChip(r, onClick)));
}

// Smart suggestion engine (tiny heuristic engine)
function smartSuggestAll(){
  // gather current values
    const name = document.getElementById('fullName').value.trim();
    const job = jobInput.value.trim();
    const skills = skillsInput.value.split(',').map(s=>s.trim()).filter(Boolean);
    const city = cityInput.value.trim();

    const suggestions = {};

  // if job empty -> suggest based on skills or name
    if(!job){
    if(skills.includes('React') || skills.includes('JavaScript')) suggestions.job = 'React Developer';
    else if(skills.includes('HTML') && skills.includes('CSS')) suggestions.job = 'Front-End Developer';
    else if(name) suggestions.job = 'Frontend Intern';
    else suggestions.job = 'Front-End Developer';
    }

  // if skills empty -> suggest set based on job
    if(skills.length === 0){
    if(job.toLowerCase().includes('react')) suggestions.skills = 'React, JavaScript, HTML, CSS';
    else suggestions.skills = 'HTML, CSS, JavaScript';
    }

  // city suggestion default
    if(!city) suggestions.city = 'Cairo';

    displaySmartSuggestions(suggestions);
}

// show suggestions in smartBox with accept buttons
function displaySmartSuggestions(obj){
    smartBox.innerHTML = '';
    const keys = Object.keys(obj);
    if(keys.length === 0){
    smartBox.textContent = 'No suggestions found.';
    return;
    }
    keys.forEach(k => {
    const row = document.createElement('div');
    row.style.marginBottom = '8px';
    const label = document.createElement('div');
    label.textContent = k.toUpperCase();
    label.style.fontSize = '13px';
    label.style.color = '#9aa6b2';
    const val = document.createElement('div');
    val.style.marginTop = '4px';
    const chip = makeChip(obj[k], (v) => {
      // accept suggestion
        if(k === 'job') jobInput.value = v;
        if(k === 'skills') skillsInput.value = v;
        if(k === 'city') cityInput.value = v;
    });
    val.appendChild(chip);
    row.appendChild(label);
    row.appendChild(val);
    smartBox.appendChild(row);
    });
}

// events
autoBtn.addEventListener('click', smartSuggestAll);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Demo submit! Check console for values.');
    console.log({
    fullName: document.getElementById('fullName').value,
    jobTitle: jobInput.value,
    skills: skillsInput.value,
    city: cityInput.value
    });
});
