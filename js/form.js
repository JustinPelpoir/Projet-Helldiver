function quizAlert(event) {

  event.preventDefault();

  const form = document.getElementById('QuizId');
    const infos = form.querySelectorAll('#informations input, #informations select');
    let valid = true;

    infos.forEach(field => {
      if (!field.checkValidity()) {
        valid = false;
        field.reportValidity(); // Affiche l'erreur pour l'utilisateur
      }
    });

    if (valid) {
      alert("Merci pour votre inscription. Le quiz démocratique va commencer...");
      document.getElementById('informations').style.display = 'none';
      document.getElementById('quiz').style.display = 'block';
    }
  }


const correctAnswers = {
  q1: 'b',                // ex. la bonne réponse à la question 1
  q2: 'c',                // bonne réponse question 2
  q3: ['b', 'c'],              // bonnes cases cochées question 3
  q4: answer => answer.trim().length > 0,           // valide si non-vide
  q5: value => parseInt(value, 10) >= 10              // ex. note ≥ 5/10
};


function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  const setA = new Set(a), setB = new Set(b);
  if (setA.size !== setB.size) return false;
  for (let v of setA) if (!setB.has(v)) return false;
  return true;
}

 
  function submitQuiz() {

    let attempts = parseInt(localStorage.getItem('quizAttempts') || '0', 10);
    attempts++;
    localStorage.setItem('quizAttempts', attempts);

    
    // Calcule le score
      let score = 0;
      // Q1 & Q2 (radio)
      ['q1','q2'].forEach(q => {
        const sel = document.querySelector(`input[name="${q}"]:checked`);
        if (sel && sel.value === correctAnswers[q]) score++;
      });

      // Q3 (checkbox)
      const sel3 = Array.from(
        document.querySelectorAll(`input[name="q3[]"]:checked`)
      ).map(cb => cb.value);
      if (arraysEqual(sel3, correctAnswers.q3)) score++;

      // Q4 (texte libre)
      const text4 = document.getElementById('q4').value;
      if (correctAnswers.q4(text4)) score++;

      // Q5 (range)
      const val5 = document.getElementById('q5').value;
      if (correctAnswers.q5(val5)) score=score + 10;


      const tbody = document.querySelector('#result tbody');
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${attempts}</td><td>${score}</td>`;
      tbody.appendChild(tr);


      alert("Merci pour vos réponses ! Vive la démocratie encadrée !");

  }