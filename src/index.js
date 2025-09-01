// Imports
import { Buffer } from 'buffer';
window.Buffer = Buffer;
import SmlProtocol from 'smartmeter-obis/lib/protocols/SmlProtocol.js';
import Obis from 'smartmeter-obis/lib/ObisNames.js';

const writeDataCallback = (err, data) => {
  const output = document.getElementById('output');
  output.innerHTML = "";

  if (err) {
    output.textContent = "Error: " + (err.message ?? String(err));
    return;
  }

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.tableLayout = "auto";
  table.style.width = "auto";
  table.border = "1";

  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  ["OBIS-ID", "Name", "Value"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    th.style.whiteSpace = "nowrap";
	th.style.padding = "4px";
    th.style.border = "1px solid #ccc";
    th.style.padding = "6px";
    headerRow.appendChild(th);
  });

  const tbody = table.createTBody();
  Object.entries(data).forEach(([obisId, entry]) => {
    const value = entry.valueToString?.() ?? entry.value;
    const resolved = Obis.resolveObisName(entry, 'en');

    const row = tbody.insertRow();
    [obisId, resolved.obisName || resolved.customName || "Unknown", value].forEach(cellValue => {
      const td = row.insertCell();
      td.textContent = cellValue;
      td.style.border = "1px solid #ccc";
	  td.style.whiteSpace = "nowrap";
    });
  });

  output.appendChild(table);
};



window.decodeSml = function(hexString) {
  const cleaned = hexString
    .replace(/0x/g, '')
    .replace(/,\s*/g, '')
    .toLowerCase();

	const options = {
	  protocol: "SmlProtocol",
	  protocolSmlIgnoreInvalidCRC: true,
	  logger: console.log,
	  //debug: 2,
	};

    const smProtocol = new SmlProtocol(options, writeDataCallback);
	smProtocol.handleMessage(cleaned);

};

