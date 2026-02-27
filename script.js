const h2Points = { A: 20, B: 17.5, C: 15, D: 12.5, E: 10, S: 5, U: 0 };
const h1Points = { A: 10, B: 8.75, C: 7.5, D: 6.25, E: 5, S: 2.5, U: 0 };

const round2 = (num) => Math.round(num * 100) / 100;

function calculateScore() {
    // 1. Inputs
    const h2Inputs = [
        document.getElementById("subject1").value,
        document.getElementById("subject2").value,
        document.getElementById("subject3").value
    ];
    const fourthGrade = document.getElementById("fourthSubject").value;
    const mtlGrade = document.getElementById("mtl").value;
    const gpGrade = document.getElementById("gp").value;
    const isH2 = document.getElementById("isH2").checked;
    const isH1 = document.getElementById("isH1").checked;

    if (fourthGrade && fourthGrade !== "None" && !isH1 && !isH2) {
        alert("Please choose if the 4th subject is H1 or H2.");
        return;
    }

    // 2. Core Logic: Pool and Sort H2s
    let h2Pool = h2Inputs.map(g => h2Points[g]);
    let extraPoints = 0;
    let fourthLevel = "";

    if (fourthGrade && fourthGrade !== "None") {
        if (isH2) {
            h2Pool.push(h2Points[fourthGrade]);
            fourthLevel = "H2";
        } else {
            extraPoints = h1Points[fourthGrade];
            fourthLevel = "H1";
        }
    }

    // Sort descending to find top 3
    h2Pool.sort((a, b) => b - a);
    const top3H2Sum = h2Pool.slice(0, 3).reduce((a, b) => a + b, 0);
    
    // If we had 4 H2s, the 4th one becomes an H1 (halve its points)
    if (isH2 && h2Pool.length === 4) {
        extraPoints = h2Pool[3] / 2; 
    }

    const gpPts = h1Points[gpGrade];
    const mtlPts = mtlGrade ? h1Points[mtlGrade] : 0;
    const baseScore = top3H2Sum + gpPts;

    // 3. Scenarios
    let best = { score: baseScore, method: "(3 H2 + GP)", formula: `${baseScore} / 70`, fInc: false, mInc: false };

    const check = (score, method, formula, fInc, mInc) => {
        if (score > best.score) best = { score, method, formula, fInc, mInc };
    };

    if (extraPoints > 0) 
        check((baseScore + extraPoints) / 80 * 70, `With 4th Sub (${fourthLevel})`, `(${baseScore} + ${extraPoints}) / 80 × 70`, true, false);
    
    if (mtlPts > 0) 
        check((baseScore + mtlPts) / 80 * 70, "With MTL", `(${baseScore} + ${mtlPts}) / 80 × 70`, false, true);
    
    if (extraPoints > 0 && mtlPts > 0) 
        check((baseScore + extraPoints + mtlPts) / 90 * 70, "With 4th Sub + MTL", `(${baseScore} + ${extraPoints} + ${mtlPts}) / 90 × 70`, true, true);

    // 4. UI Updates
    document.getElementById("resultSection").hidden = false;
    document.getElementById("score").textContent = round2(best.score).toFixed(2); // Show best score, rounded to 2 decimals
    document.getElementById("method").textContent = best.method; // Show best method
    document.getElementById("overallScore").textContent = best.formula; // Show formula for best method
    if (best.score >= 70) launchConfetti(), alert("Congratulations! You've achieved a RP of 70! Celebrate your hard work :D 🎉");

    // Breakdown Text
    document.getElementById("breakdownSubject1").textContent = `Best H2: ${h2Pool[0]}`;
    document.getElementById("breakdownSubject2").textContent = `2nd H2: ${h2Pool[1]}`;
    document.getElementById("breakdownSubject3").textContent = `3rd H2: ${h2Pool[2]}`;
    document.getElementById("breakdownGP").textContent = `${gpGrade} = ${gpPts}`;
    
    const fSect = document.getElementById("fourthSubjectBreakdown");
    fSect.hidden = !best.fInc;
    if (best.fInc) document.getElementById("breakdownFourth").textContent = `4th Sub (as H1): ${extraPoints}`;

    let notes = best.fInc || best.mInc ? [] : ["No optional subject improved the score."];
    if (best.fInc) notes.push(`4th Sub: ${fourthGrade} (${fourthLevel})`);
    if (best.mInc) notes.push(`MTL: ${mtlGrade} (H1)`);
    document.getElementById("notes").textContent = notes.join(" | ");
}

function resetCalculator() {
    ["subject1", "subject2", "subject3", "mtl"].forEach(id => document.getElementById(id).value = "");
    document.getElementById("fourthSubject").value = "None";
    document.getElementById("gp").value = "C";
    document.getElementById("isH1").checked = false;
    document.getElementById("isH2").checked = false;
    document.getElementById("resultSection").hidden = true;
}

// confetti celebration function
function launchConfetti() {
    const count = 300;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

// dark mode toggle behaviour
window.addEventListener('DOMContentLoaded', () => {
    const darkSwitch = document.getElementById('darkSwitch');
    if (darkSwitch) {
        darkSwitch.addEventListener('change', () => {
            document.body.classList.toggle('dark', darkSwitch.checked);
        });
    }
});

