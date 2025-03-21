// Global variable to store CSV data
let csvData = [];

// On DOM load, attach event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadCSV();

  // Search tool event listener
  document.getElementById('searchButton').addEventListener('click', searchGene);

  // Tools Menu Buttons event listeners
  document.getElementById('blastMenuBtn').addEventListener('click', () => {
    showToolInCenter('blast');
  });
  document.getElementById('keggMenuBtn').addEventListener('click', () => {
    showToolInCenter('kegg');
  });
  document.getElementById('primerMenuBtn').addEventListener('click', () => {
    showToolInCenter('primer');
  });
  document.getElementById('translateMenuBtn').addEventListener('click', () => {
    showToolInCenter('translate');
  });
  document.getElementById('complementMenuBtn').addEventListener('click', () => {
    showToolInCenter('complement');
  });
  document.getElementById('uniprotMenuBtn').addEventListener('click', () => {
    showToolInCenter('uniprot');
  });
  document.getElementById('chemblMenuBtn').addEventListener('click', () => {
    showToolInCenter('chembl');
  });
});

/**
 * Load CSV file and parse its content.
 */
function loadCSV() {
  fetch('merged_brain_mri_data.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      csvData = parseCSV(data);
      console.log('CSV Data loaded:', csvData);
    })
    .catch(error => {
      console.error('Error loading CSV:', error);
    });
}

/**
 * Parse CSV data into an array of objects.
 */
function parseCSV(data) {
  const lines = data.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(header => header.trim());

  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    let rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = values[index] || ''; // Handle missing values
    });
    return rowObject;
  });
}

/**
 * Search tool: Filter CSV data based on the search term and display results.
 */
function searchGene() {
  const searchTerm = document.getElementById('studen_id').value.trim().toLowerCase();

  if (!searchTerm) {
    alert('Please enter a search term.');
    return;
  }

  // Filter the CSV data based on the search term
  const results = csvData.filter(row => {
    const student_id = row.student_id ? row.student_id.toLowerCase() : "";
    const dataset = row.Dataset ? row.Dataset.toLowerCase() : "";
    const diagnosis = row.Diagnosis ? row.Diagnosis.toLowerCase() : "";
    const file_path_y = row.File_Path_y ? row.File_Path_y.toLowerCase() : "";

    return (
      student_id.includes(searchTerm) ||
      dataset.includes(searchTerm) ||
      diagnosis.includes(searchTerm) ||
      file_path_y.includes(searchTerm)
    );
  });

  if (results.length === 0) {
    alert(`No matching results found for "${searchTerm}".`);
    return;
  }

  // Build the HTML for search results in a table format
  let htmlContent = `<h2>Search Results for "${searchTerm}"</h2>
                      <table>
                        <thead>
                          <tr>`;

  // Get headers from the first result object
  const headers = Object.keys(results[0]);
  headers.forEach(header => {
    htmlContent += `<th>${header}</th>`;
  });

  htmlContent += `</tr>
                        </thead>
                        <tbody>`;

  // Add table rows for each result
  results.forEach(row => {
    htmlContent += `<tr>`;
    headers.forEach(header => {
      htmlContent += `<td>${row[header]}</td>`;
    });
    htmlContent += `</tr>`;
  });

  htmlContent += `</tbody></table>`;

  // Update the dynamic content div
  document.getElementById('dynamicContent').innerHTML = htmlContent;
}

/**
 * Show a specific tool in the center "dynamicContent" area
 */
function showToolInCenter(toolName) {
  const dynamicContentDiv = document.getElementById('dynamicContent');

  if (toolName === 'blast') {
    dynamicContentDiv.innerHTML = `
      <h2>BLAST Tool</h2>
      <label for="blastSeq">Enter DNA/Protein Sequence (FASTA format):</label>
      <textarea id="blastSeq" rows="6" style="width:100%;" placeholder="Paste sequence..."></textarea>
      <br/><br/>
      <button onclick="runBLAST()">Run BLAST</button>
      <div id="blastResults"></div>
    `;
  } else if (toolName === 'kegg') {
    dynamicContentDiv.innerHTML = `
      <h2>KEGG Tool</h2>
      <label for="keggInputDynamic">Enter KEGG ID:</label>
      <input type="text" id="keggInputDynamic" placeholder="e.g., hsa:10458" style="width:100%;" />
      <br/><br/>
      <button onclick="openKEGGDynamic()">Open KEGG</button>
      <div id="keggResultsDynamic"></div>
    `;
  } else if (toolName === 'primer') {
    dynamicContentDiv.innerHTML = `
      <h2>Primer Designing Tool</h2>
      <label for="primerSeq">Enter Target DNA Sequence:</label>
      <textarea id="primerSeq" rows="6" style="width:100%;" placeholder="Paste sequence..."></textarea>
      <br/><br/>
      <button onclick="designPrimersDynamic()">Design Primers</button>
      <div id="primerResultsDynamic"></div>
    `;
  } else if (toolName === 'translate') {
    dynamicContentDiv.innerHTML = `
      <h2>Transcription & Translation</h2>
      <label for="transSeq">Enter DNA Sequence:</label>
      <textarea id="transSeq" rows="6" style="width:100%;" placeholder="Paste sequence..."></textarea>
      <br/><br/>
      <button onclick="transcribeDNADynamic()">Transcribe to RNA</button>
      <button onclick="translateDNADynamic()">Translate to Protein</button>
      <div id="transResultsDynamic"></div>
    `;
  } else if (toolName === 'complement') {
    dynamicContentDiv.innerHTML = `
      <h2>Complement & Reverse Complement</h2>
      <label for="compSeq">Enter DNA Sequence:</label>
      <textarea id="compSeq" rows="6" style="width:100%;" placeholder="Paste sequence..."></textarea>
      <br/><br/>
      <button onclick="complementDNADynamic()">Complement</button>
      <button onclick="reverseComplementDNADynamic()">Reverse Complement</button>
      <div id="compResultsDynamic"></div>
    `;
  } else if (toolName === 'uniprot') {
    dynamicContentDiv.innerHTML = `
      <h2>UniProt</h2>
      <label for="uniInputDynamic">Enter UniProt ID or keyword:</label>
      <input type="text" id="uniInputDynamic" placeholder="e.g., P01308" style="width:100%;" />
      <br/><br/>
      <button onclick="openUniProtDynamic()">Open UniProt</button>
    `;
  } else if (toolName === 'chembl') {
    dynamicContentDiv.innerHTML = `
      <h2>ChEMBL</h2>
      <label for="chemblInputDynamic">Enter ChEMBL ID or keyword:</label>
      <input type="text" id="chemblInputDynamic" placeholder="e.g., CHEMBL25" style="width:100%;" />
      <br/><br/>
      <button onclick="openChEMBLDynamic()">Open ChEMBL</button>
    `;
  }
}

/**
 * BLAST Tool - dynamic
 */
function runBLAST() {
  const seq = document.getElementById('blastSeq').value.trim();
  if (!seq) {
    alert("Please enter a sequence.");
    return;
  }
  const blastURL = `https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Put&QUERY=${encodeURIComponent(seq)}&DATABASE=nr&PROGRAM=blastp`;
  document.getElementById('blastResults').innerHTML = `
    <p>Running BLAST... <a href="${blastURL}" target="_