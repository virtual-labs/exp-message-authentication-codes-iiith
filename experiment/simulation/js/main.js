/**
 * CBC-MAC Simulation - Main JavaScript File
 * Consolidated from cbc-mac.js, secure_cbc-mac_clean.js, and cbc-mac-dataset.js
 *
 * This file contains:
 * 1. Core CBC-MAC utility functions
 * 2. Part 1 (Basic CBC-MAC) functions
 * 3. Part 2 (Secure CBC-MAC) functions
 * 4. Dataset-based learning functions
 */

// =============================================================================
// GLOBAL VARIABLES
// =============================================================================
var current_l = 4;
var current_function = "1100";
var currentDatasetIndex = 0;
var currentStepIndex = 0;
var CBC_MAC_DATASET = null; // Will be loaded from JSON

// =============================================================================
// CORE UTILITY FUNCTIONS
// =============================================================================

function trim(str) {
  return str.replace(/\s+/g, "");
}

function validate_binary(input) {
  var len = input.length;
  var i;
  for (i = 0; i < len; i++) {
    if (input.charAt(i) != "0" && input.charAt(i) != "1") {
      break;
    }
  }
  if (i < len) {
    return 0;
  }
  return 1;
}

function isUnsignedInteger(s) {
  return s.toString().search(/^[0-9]+$/) == 0;
}

function rand_sequence(len) {
  var ret = "";
  for (var i = 0; i < len; i++) {
    ret += Math.ceil(Math.random() * 1000000) % 2;
  }
  return ret;
}

function XOR(a, b) {
  if (a == "0" && b == "0") return "0";
  else if (a == "0" && b == "1") return "1";
  else if (a == "1" && b == "0") return "1";
  else if (a == "1" && b == "1") return "0";
  return "0";
}

function EQV(a, b) {
  if (a == "0" && b == "0") return "1";
  else if (a == "0" && b == "1") return "0";
  else if (a == "1" && b == "0") return "0";
  else if (a == "1" && b == "1") return "1";
  return "1";
}

function xor_strings(a, b) {
  var ret = "";
  for (var i = 0; i < a.length; i++) {
    ret += XOR(a.charAt(i), b.charAt(i));
  }
  return ret;
}

function shrink_key(key, l) {
  var new_key = "";
  var i = 0;
  for (i = 0; i < l; i++) {
    new_key += key.charAt(i);
  }
  return new_key;
}

function expand_key(key, l) {
  var original_len = key.length;
  var new_key = key;
  var i = original_len;
  for (i = original_len; i < l; i++) {
    new_key += key.charAt(i % original_len);
  }
  return new_key;
}

function resize_key(key, l) {
  if (key.length == l) return key;
  else if (key.length > l) return shrink_key(key, l);
  else return expand_key(key, l);
}

function function_value(input, key) {
  var selected_l = function_selected_l(input.length);
  key = resize_key(key, selected_l);
  var output = "";
  var i = 0;
  for (i = 0; i < input.length; i++) {
    if (current_function.charAt(i) == "0") {
      output += XOR(input.charAt(i), key.charAt(i));
    } else {
      output += EQV(input.charAt(i), key.charAt(i));
    }
  }
  return output;
}

function function_selected_l(l) {
  if (l <= current_l) return l;
  else return current_l;
}

function pad_input(input) {
  var len = input.length;
  var blocks = Math.ceil(len / current_l);
  var target_length = blocks * current_l;
  while (input.length < target_length) {
    input += "0"; // Simple padding with zeros
  }
  return input;
}

// =============================================================================
// PART 1: BASIC CBC-MAC FUNCTIONS
// =============================================================================

function next_plain_text() {
  var len = (Math.random() * 100) % 100;
  document.getElementById("plaintext").value = rand_sequence(len);
}

function next_key() {
  var len = (Math.random() * 100) % 100;
  document.getElementById("key").value = rand_sequence(len);
}

function next_IV() {
  var l = document.getElementById("l").value;
  if (!isUnsignedInteger(l)) {
    alert("l should be a positive integer");
    return;
  }
  var text_size = document.getElementById("plaintext").value.length;
  if (text_size > 2 * l) {
    current_l = l;
    current_function = next_function(l);
  } else {
    alert("l should not be greater than the (length of plaintext)/2");
    document.getElementById("l").value = current_l;
    return;
  }
  document.getElementById("iv").value = rand_sequence(current_l);
  updateFunctionDisplay(); // Update the display when current_l changes
}

function next_function() {
  var oldFunction = current_function;
  current_function = rand_sequence(current_l);

  // Show immediate feedback about the function change
  console.log(`Function changed from ${oldFunction} to ${current_function}`);

  updateFunctionDisplay();

  // Show a temporary notification about the function change
  showFunctionChangeNotification(oldFunction, current_function);
}

function next_function_secure() {
  var oldFunction = current_function;
  current_function = rand_sequence(current_l);

  // Show immediate feedback about the function change
  console.log(
    `Secure CBC-MAC Function changed from ${oldFunction} to ${current_function}`
  );

  updateFunctionDisplay();
  updateFunctionDisplaySecure();

  // Show a temporary notification about the function change for Part 2
  showFunctionChangeNotificationSecure(oldFunction, current_function);
}

function updateFunctionDisplay() {
  // Show the current function in a display element
  var functionDisplay = document.getElementById("function-display");
  if (!functionDisplay) {
    // Create function display if it doesn't exist
    functionDisplay = document.createElement("div");
    functionDisplay.id = "function-display";
    functionDisplay.style.cssText =
      "background: #e8f4f8; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #17a2b8;";

    // Try multiple ways to find a good place to insert the display
    var inserted = false;

    // Method 1: Try to find the function test section
    var testSections = document.querySelectorAll("p strong");
    for (var i = 0; i < testSections.length; i++) {
      if (testSections[i].textContent.includes("Test Function")) {
        var container = testSections[i].closest("div");
        if (container) {
          container.appendChild(functionDisplay);
          inserted = true;
          break;
        }
      }
    }

    // Method 2: If that fails, insert after the usertext table
    if (!inserted) {
      var userTextInput = document.getElementById("usertext");
      if (userTextInput) {
        var table = userTextInput.closest("table");
        if (table && table.parentNode) {
          table.parentNode.insertBefore(functionDisplay, table.nextSibling);
          inserted = true;
        }
      }
    }

    // Method 3: Last resort - append to a known container
    if (!inserted) {
      var mainContent = document.querySelector(".content") || document.body;
      mainContent.appendChild(functionDisplay);
    }
  }

  functionDisplay.innerHTML = `
    <strong>🔧 Current Function F<sub>k</sub>:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">${current_function}</code>
    <br><small>This determines how XOR (0) or EQV (1) operations are applied to each bit position.</small>
  `;

  // Update required length display
  var requiredLengthSpan = document.getElementById("required-length");
  if (requiredLengthSpan) {
    requiredLengthSpan.textContent = current_l;
  }
}

function showFunctionChangeNotification(oldFunction, newFunction) {
  // Create or update a temporary notification showing the function change
  var changeNotification = document.getElementById(
    "function-change-notification"
  );
  if (!changeNotification) {
    changeNotification = document.createElement("div");
    changeNotification.id = "function-change-notification";
    changeNotification.style.cssText =
      "background: #d1ecf1; color: #0c5460; padding: 10px; margin: 5px 0; border-radius: 4px; border: 1px solid #bee5eb; font-size: 14px; animation: fadeInOut 4s ease-in-out;";

    // Add CSS animation
    if (!document.getElementById("notification-styles")) {
      var style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `;
      document.head.appendChild(style);
    }

    // Insert near the Generate New Function button
    var generateButton = document.querySelector(
      'input[value="Generate New Function"]'
    );
    if (generateButton) {
      var buttonCell = generateButton.parentNode;
      buttonCell.appendChild(changeNotification);
    }
  }

  changeNotification.innerHTML = `
    <strong>🔄 Function Updated!</strong><br>
    <small>Changed from <code style="background: #fff; padding: 1px 4px; border-radius: 2px;">${oldFunction}</code> to <code style="background: #fff; padding: 1px 4px; border-radius: 2px;">${newFunction}</code></small>
  `;

  // Reset animation
  changeNotification.style.animation = "none";
  setTimeout(() => {
    changeNotification.style.animation = "fadeInOut 4s ease-in-out";
  }, 10);

  // Remove the notification after animation
  setTimeout(() => {
    if (changeNotification.parentNode) {
      changeNotification.parentNode.removeChild(changeNotification);
    }
  }, 4000);
}

function showFunctionChangeNotificationSecure(oldFunction, newFunction) {
  // Create or update a temporary notification showing the function change for Part 2
  var changeNotification = document.getElementById(
    "function-change-notification-secure"
  );
  if (!changeNotification) {
    changeNotification = document.createElement("div");
    changeNotification.id = "function-change-notification-secure";
    changeNotification.style.cssText =
      "background: #d1ecf1; color: #0c5460; padding: 10px; margin: 5px 0; border-radius: 4px; border: 1px solid #bee5eb; font-size: 14px; animation: fadeInOut 4s ease-in-out;";

    // Insert near the Generate New Function button in Part 2
    var generateButton = document.querySelector('input[name="nextFunction2"]');
    if (generateButton) {
      var buttonCell = generateButton.parentNode;
      buttonCell.appendChild(changeNotification);
    }
  }

  changeNotification.innerHTML = `
    <strong>🔄 Secure CBC-MAC Function Updated!</strong><br>
    <small>Changed from <code style="background: #fff; padding: 1px 4px; border-radius: 2px;">${oldFunction}</code> to <code style="background: #fff; padding: 1px 4px; border-radius: 2px;">${newFunction}</code></small>
  `;

  // Reset animation
  changeNotification.style.animation = "none";
  setTimeout(() => {
    changeNotification.style.animation = "fadeInOut 4s ease-in-out";
  }, 10);

  // Remove the notification after animation
  setTimeout(() => {
    if (changeNotification.parentNode) {
      changeNotification.parentNode.removeChild(changeNotification);
    }
  }, 4000);
}

function apply_function() {
  var input = document.getElementById("usertext").value;
  var l = input.length;

  // Clear any previous error messages
  var notification = document.getElementById("function-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.id = "function-notification";
    notification.style.cssText =
      "padding: 8px; margin: 5px 0; border-radius: 4px; font-size: 14px;";

    // Insert after the usertext input by finding the table cell and adding after it
    var userTextInput = document.getElementById("usertext");
    var tableCell = userTextInput.parentNode;
    tableCell.appendChild(notification);
  }

  if (validate_binary(input) == 0) {
    notification.innerHTML = "⚠️ Please enter only binary digits (0 and 1)";
    notification.style.backgroundColor = "#fff3cd";
    notification.style.color = "#856404";
    notification.style.border = "1px solid #ffeaa7";
    // Clear the invalid input and show expected format
    document.getElementById("usertext").value = "";
    document.getElementById(
      "usertext"
    ).placeholder = `Enter ${current_l} binary digits (e.g., ${"0".repeat(
      current_l
    )})`;
    return;
  }

  if (l != current_l) {
    notification.innerHTML = `⚠️ Please enter exactly ${current_l} binary digits. You entered ${l} digits.`;
    notification.style.backgroundColor = "#fff3cd";
    notification.style.color = "#856404";
    notification.style.border = "1px solid #ffeaa7";
    // Clear the input and show expected format
    document.getElementById("usertext").value = "";
    document.getElementById(
      "usertext"
    ).placeholder = `Enter ${current_l} binary digits (e.g., ${"01"
      .repeat(Math.ceil(current_l / 2))
      .substring(0, current_l)})`;
    return;
  }

  // Success - clear notification and show result
  notification.innerHTML = "✅ Function applied successfully!";
  notification.style.backgroundColor = "#d4edda";
  notification.style.color = "#155724";
  notification.style.border = "1px solid #c3e6cb";

  var key = document.getElementById("key").value;
  key = resize_key(key, l);
  var result = function_value(input, key);
  document.getElementById("functionvalue").value = result;

  // Show detailed calculation
  showFunctionCalculation(input, key, result);
}

function showFunctionCalculation(input, key, result) {
  var calcDisplay = document.getElementById("calculation-display");
  if (!calcDisplay) {
    calcDisplay = document.createElement("div");
    calcDisplay.id = "calculation-display";
    calcDisplay.style.cssText =
      "background: #f8f9fa; padding: 12px; margin: 10px 0; border-radius: 6px; border: 1px solid #dee2e6;";

    // Insert after function output
    var functionOutput = document.getElementById("functionvalue");
    functionOutput.parentNode.parentNode.parentNode.insertBefore(
      calcDisplay,
      functionOutput.parentNode.parentNode.nextSibling
    );
  }

  var steps = [];
  var resizedKey = resize_key(key, input.length);

  for (var i = 0; i < input.length; i++) {
    var operation = current_function.charAt(i) == "0" ? "XOR" : "EQV";
    var bitResult =
      current_function.charAt(i) == "0"
        ? XOR(input.charAt(i), resizedKey.charAt(i))
        : EQV(input.charAt(i), resizedKey.charAt(i));

    steps.push(
      `Position ${i}: ${input.charAt(i)} ${operation} ${resizedKey.charAt(
        i
      )} = ${bitResult}`
    );
  }

  calcDisplay.innerHTML = `
    <h6 style="margin: 0 0 8px 0; color: #495057;">🔍 Function F<sub>k</sub> Calculation Details:</h6>
    <div style="font-family: monospace; font-size: 13px;">
      <strong>Input:</strong> ${input}<br>
      <strong>Key (resized):</strong> ${resizedKey}<br>
      <strong>Function pattern:</strong> ${current_function}<br>
      <strong>Calculation:</strong><br>
      ${steps.map((step) => `&nbsp;&nbsp;• ${step}`).join("<br>")}
      <br><strong>Result:</strong> <span style="background: #e3f2fd; padding: 2px 6px; border-radius: 3px;">${result}</span>
    </div>
  `;
}

function CheckAnswer() {
  var user_answer = document.getElementById("outputarea").value;
  var notification = document.getElementById("notification");

  if (user_answer.length == 0) {
    alert("Please enter an answer!");
    return;
  }

  var plaintext = pad_input(document.getElementById("plaintext").value);
  var iv = document.getElementById("iv").value;
  var key = document.getElementById("key").value;
  var numChunks = plaintext.length / current_l;

  for (var i = 0; i < numChunks; i++) {
    var startIndex = i * current_l;
    var gethashfor = xor_strings(
      iv,
      plaintext.substring(startIndex, startIndex + current_l)
    );
    iv = function_value(gethashfor, key);
  }

  if (trim(user_answer) == trim(iv)) {
    notification.innerHTML =
      "✅ CORRECT! Your CBC-MAC calculation is accurate!";
    notification.style.backgroundColor = "#d4edda";
    notification.style.color = "#155724";
    notification.style.border = "2px solid #28a745";
  } else {
    notification.innerHTML =
      "❌ Incorrect answer. Expected: " +
      iv +
      ", You entered: " +
      user_answer +
      ". Please try again!";
    notification.style.backgroundColor = "#f8d7da";
    notification.style.color = "#721c24";
    notification.style.border = "2px solid #dc3545";
  }
}

// =============================================================================
// PART 2: SECURE CBC-MAC FUNCTIONS
// =============================================================================

function next_plain_text_secure() {
  var len = (Math.random() * 100) % 100;
  document.getElementById("plaintext2").value = rand_sequence(len);
}

function next_key_secure() {
  var len = (Math.random() * 100) % 100;
  document.getElementById("key2").value = rand_sequence(len);
}

function next_key2() {
  var len = (Math.random() * 100) % 100;
  document.getElementById("secondKey").value = rand_sequence(len);
}

function next_IV_secure() {
  var l = document.getElementById("l2").value;
  if (!isUnsignedInteger(l)) {
    alert("l should be a positive integer");
    return;
  }
  var text_size = document.getElementById("plaintext2").value.length;
  if (text_size > 2 * l) {
    current_l = l;
    current_function = next_function(l);
  } else {
    alert("l should not be greater than the (length of plaintext)/2");
    document.getElementById("l2").value = current_l;
    return;
  }
  document.getElementById("iv2").value = rand_sequence(current_l);
}

function apply_function_secure() {
  var input = document.getElementById("usertext2").value;
  var l = input.length;

  // Clear any previous error messages
  var notification = document.getElementById("function-notification-secure");
  if (!notification) {
    notification = document.createElement("div");
    notification.id = "function-notification-secure";
    notification.style.cssText =
      "padding: 8px; margin: 5px 0; border-radius: 4px; font-size: 14px;";

    // Insert after the usertext2 input by finding the table cell and adding after it
    var userTextInput = document.getElementById("usertext2");
    var tableCell = userTextInput.parentNode;
    tableCell.appendChild(notification);
  }

  if (validate_binary(input) == 0) {
    notification.innerHTML = "⚠️ Please enter only binary digits (0 and 1)";
    notification.style.backgroundColor = "#fff3cd";
    notification.style.color = "#856404";
    notification.style.border = "1px solid #ffeaa7";
    // Clear the invalid input and show expected format
    document.getElementById("usertext2").value = "";
    document.getElementById(
      "usertext2"
    ).placeholder = `Enter ${current_l} binary digits (e.g., ${"0".repeat(
      current_l
    )})`;
    return;
  }

  if (l != current_l) {
    notification.innerHTML = `⚠️ Please enter exactly ${current_l} binary digits. You entered ${l} digits.`;
    notification.style.backgroundColor = "#fff3cd";
    notification.style.color = "#856404";
    notification.style.border = "1px solid #ffeaa7";
    // Clear the input and show expected format
    document.getElementById("usertext2").value = "";
    document.getElementById(
      "usertext2"
    ).placeholder = `Enter ${current_l} binary digits (e.g., ${"01"
      .repeat(Math.ceil(current_l / 2))
      .substring(0, current_l)})`;
    return;
  }

  // Success - clear notification and show result
  notification.innerHTML = "✅ Function applied successfully!";
  notification.style.backgroundColor = "#d4edda";
  notification.style.color = "#155724";
  notification.style.border = "1px solid #c3e6cb";

  var key = document.getElementById("key2").value;
  key = resize_key(key, l);
  var result = function_value(input, key);
  document.getElementById("functionvalue2").value = result;

  // Show detailed calculation for Part 2
  showFunctionCalculationSecure(input, key, result);
}

function showFunctionCalculationSecure(input, key, result) {
  var calcDisplay = document.getElementById("calculation-display-secure");
  if (!calcDisplay) {
    calcDisplay = document.createElement("div");
    calcDisplay.id = "calculation-display-secure";
    calcDisplay.style.cssText =
      "background: #f8f9fa; padding: 12px; margin: 10px 0; border-radius: 6px; border: 1px solid #dee2e6;";

    // Insert after function output in Part 2
    var functionOutput = document.getElementById("functionvalue2");
    if (functionOutput) {
      var table = functionOutput.closest("table");
      if (table && table.parentNode) {
        table.parentNode.insertBefore(calcDisplay, table.nextSibling);
      }
    }
  }

  var steps = [];
  var resizedKey = resize_key(key, input.length);

  for (var i = 0; i < input.length; i++) {
    var operation = current_function.charAt(i) == "0" ? "XOR" : "EQV";
    var bitResult =
      current_function.charAt(i) == "0"
        ? XOR(input.charAt(i), resizedKey.charAt(i))
        : EQV(input.charAt(i), resizedKey.charAt(i));

    steps.push(
      `Position ${i}: ${input.charAt(i)} ${operation} ${resizedKey.charAt(
        i
      )} = ${bitResult}`
    );
  }

  calcDisplay.innerHTML = `
    <h6 style="margin: 0 0 8px 0; color: #495057;">🔍 Secure CBC-MAC Function F<sub>k</sub> Calculation Details:</h6>
    <div style="font-family: monospace; font-size: 13px;">
      <strong>Input:</strong> ${input}<br>
      <strong>Key (resized):</strong> ${resizedKey}<br>
      <strong>Function pattern:</strong> ${current_function}<br>
      <strong>Calculation:</strong><br>
      ${steps.map((step) => `&nbsp;&nbsp;• ${step}`).join("<br>")}
      <br><strong>Result:</strong> <span style="background: #e3f2fd; padding: 2px 6px; border-radius: 3px;">${result}</span>
    </div>
  `;
}

function reset() {
  document.getElementById("user_message").style.display = "none";
  document.getElementById("userKey").style.display = "none";
  document.getElementById("key_generated2").style.display = "none";
}

function select() {
  var selectmenu = document.getElementById("secureOptions");
  var chosen_option = selectmenu.options[selectmenu.selectedIndex];
  reset();
  if (chosen_option.value == "key") {
    document.getElementById("userKey").style.display = "block";
  } else if (chosen_option.value == "length") {
    document.getElementById("user_message").style.display = "block";
  } else {
    document.getElementById("key_generated2").style.display = "block";
  }
}

function CheckSecureAnswer() {
  var notification = document.getElementById("notification2");
  var selectedOption = document.getElementById("secureOptions").value;

  if (!notification) {
    console.error("Notification element not found");
    return;
  }

  notification.innerHTML =
    "✅ Good choice! You selected: " +
    selectedOption +
    " method for secure CBC-MAC. This helps prevent length extension and other attacks.";
  notification.style.backgroundColor = "#d1ecf1";
  notification.style.color = "#0c5460";
  notification.style.border = "2px solid #17a2b8";
}

// =============================================================================
// DATASET-BASED LEARNING FUNCTIONS
// =============================================================================

// Load dataset from JSON file
async function loadDataset() {
  try {
    const response = await fetch("json/dataset-approach.json");
    const data = await response.json();
    CBC_MAC_DATASET = data.examples;
    console.log("Dataset loaded successfully:", data.metadata);
  } catch (error) {
    console.error("Error loading dataset:", error);
    // Fallback to empty dataset
    CBC_MAC_DATASET = [];
  }
}

function loadDatasetExample(index) {
  if (!CBC_MAC_DATASET || index >= CBC_MAC_DATASET.length || index < 0) {
    console.error("Invalid dataset index or dataset not loaded");
    return;
  }

  currentDatasetIndex = index;
  currentStepIndex = 0;
  var example = CBC_MAC_DATASET[index];

  // Load the example data into the form
  document.getElementById("plaintext").value = example.plaintext;
  document.getElementById("key").value = example.key;
  document.getElementById("iv").value = example.iv;
  document.getElementById("l").value = example.blockSize;

  // Clear previous results
  document.getElementById("outputarea").value = "";
  document.getElementById("functionvalue").value = "";

  // Show example description
  showExampleInfo(example);

  // Reset step-by-step display
  showCurrentStep();
}

function showExampleInfo(example) {
  var infoDiv = document.getElementById("example-info");
  if (!infoDiv) {
    infoDiv = document.createElement("div");
    infoDiv.id = "example-info";
    infoDiv.style.cssText =
      "background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2196f3;";
    document
      .querySelector(".content")
      .insertBefore(infoDiv, document.querySelector(".content").firstChild);
  }

  infoDiv.innerHTML = `
    <h4>📚 Example ${example.id}: ${example.description} (${example.level})</h4>
    <p><strong>Learning Objective:</strong> ${example.learningPoints.join(
      ", "
    )}</p>
    <p><strong>Expected Final MAC:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">${
      example.finalMAC
    }</code></p>
  `;
}

function showCurrentStep() {
  if (!CBC_MAC_DATASET || currentDatasetIndex >= CBC_MAC_DATASET.length) {
    return;
  }

  var example = CBC_MAC_DATASET[currentDatasetIndex];
  var step = example.steps[currentStepIndex];

  var stepDiv = document.getElementById("step-info");
  if (!stepDiv) {
    stepDiv = document.createElement("div");
    stepDiv.id = "step-info";
    stepDiv.style.cssText =
      "background: #fff3e0; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ff9800;";

    var exampleInfo = document.getElementById("example-info");
    if (exampleInfo) {
      exampleInfo.parentNode.insertBefore(stepDiv, exampleInfo.nextSibling);
    }
  }

  if (step) {
    stepDiv.innerHTML = `
      <h5>🔢 Step ${step.step}: ${step.description}</h5>
      <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 8px 0;">
        <strong>Input:</strong> <code>${step.input}</code><br>
        <strong>Operation:</strong> ${step.operation}<br>
        <strong>Calculation:</strong> ${step.calculation}<br>
        <strong>Expected Result:</strong> <code style="background: #c8e6c9; padding: 2px 6px;">${
          step.expected
        }</code>
      </div>
      <div style="margin-top: 10px;">
        <button onclick="nextStep()" style="background: #4caf50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Next Step →</button>
        <button onclick="prevStep()" style="background: #757575; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-left: 8px;">← Previous Step</button>
        <span style="margin-left: 15px; color: #666;">Step ${
          currentStepIndex + 1
        } of ${example.steps.length}</span>
      </div>
    `;
  } else {
    stepDiv.innerHTML = `
      <h5>🎯 All Steps Complete!</h5>
      <p>Now calculate the final MAC and enter it in the "Final Output" field below.</p>
      <button onclick="resetSteps()" style="background: #2196f3; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Review Steps</button>
    `;
  }
}

function nextStep() {
  if (!CBC_MAC_DATASET || currentDatasetIndex >= CBC_MAC_DATASET.length) {
    return;
  }

  var example = CBC_MAC_DATASET[currentDatasetIndex];
  if (currentStepIndex < example.steps.length - 1) {
    currentStepIndex++;
    showCurrentStep();
  } else {
    currentStepIndex = example.steps.length;
    showCurrentStep();
  }
}

function prevStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    showCurrentStep();
  }
}

function resetSteps() {
  currentStepIndex = 0;
  showCurrentStep();
}

function nextExample() {
  if (CBC_MAC_DATASET && currentDatasetIndex < CBC_MAC_DATASET.length - 1) {
    loadDatasetExample(currentDatasetIndex + 1);
  }
}

function prevExample() {
  if (currentDatasetIndex > 0) {
    loadDatasetExample(currentDatasetIndex - 1);
  }
}

function CheckAnswerWithDataset() {
  if (!CBC_MAC_DATASET || currentDatasetIndex >= CBC_MAC_DATASET.length) {
    // Fallback to original check
    CheckAnswer();
    return;
  }

  var userAnswer = document.getElementById("outputarea").value;
  var example = CBC_MAC_DATASET[currentDatasetIndex];
  var notification = document.getElementById("notification");

  if (trim(userAnswer) === trim(example.finalMAC)) {
    notification.innerHTML = `
      ✅ <strong>EXCELLENT!</strong> Your answer "${userAnswer}" is correct!<br>
      <small>You successfully calculated the CBC-MAC for Example ${example.id}</small>
    `;
    notification.style.backgroundColor = "#d4edda";
    notification.style.color = "#155724";
    notification.style.border = "2px solid #28a745";

    // Auto-advance to next example after success
    setTimeout(function () {
      if (currentDatasetIndex < CBC_MAC_DATASET.length - 1) {
        if (confirm("Great job! Would you like to try the next example?")) {
          nextExample();
        }
      } else {
        alert("🎉 Congratulations! You've completed all CBC-MAC examples!");
      }
    }, 2000);
  } else {
    notification.innerHTML = `
      ❌ <strong>Not quite right.</strong><br>
      Expected: <code>${example.finalMAC}</code><br>
      You entered: <code>${userAnswer}</code><br>
      <small>💡 Tip: Review the step-by-step calculation above and try again!</small>
    `;
    notification.style.backgroundColor = "#f8d7da";
    notification.style.color = "#721c24";
    notification.style.border = "2px solid #dc3545";
  }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize the simulation when the page loads
window.addEventListener("DOMContentLoaded", async function () {
  await loadDataset();
  if (CBC_MAC_DATASET && CBC_MAC_DATASET.length > 0) {
    loadDatasetExample(0); // Start with the first example
  }

  // Initialize function display
  setTimeout(() => {
    updateFunctionDisplay();
    updateFunctionDisplaySecure(); // Add function display for Part 2
    addFunctionOutputExplanation();
    addFunctionOutputExplanationSecure(); // Add explanation for Part 2
  }, 100);
});

function addFunctionOutputExplanation() {
  // Add explanation for the Function output field
  var functionOutput = document.getElementById("functionvalue");
  if (functionOutput && !document.getElementById("output-explanation")) {
    var explanation = document.createElement("div");
    explanation.id = "output-explanation";
    explanation.style.cssText =
      "background: #e8f5e8; padding: 8px; margin: 5px 0; border-radius: 4px; font-size: 13px; border-left: 3px solid #28a745;";
    explanation.innerHTML = `
      <strong>💡 About Function Output:</strong> This field shows the result when you apply the cryptographic function F<sub>k</sub> to your input text. 
      The function uses the current function pattern and key to transform your binary input into the corresponding output.
    `;

    functionOutput.parentNode.parentNode.parentNode.insertBefore(
      explanation,
      functionOutput.parentNode.parentNode.nextSibling
    );
  }
}

function updateFunctionDisplaySecure() {
  // Show the current function in a display element for Part 2
  var functionDisplay = document.getElementById("function-display-secure");
  if (!functionDisplay) {
    // Create function display if it doesn't exist
    functionDisplay = document.createElement("div");
    functionDisplay.id = "function-display-secure";
    functionDisplay.style.cssText =
      "background: #e8f4f8; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #17a2b8;";

    // Try to find the Part 2 test function section
    var inserted = false;

    // Look for "Test Function" text in Part 2
    var testSections = document.querySelectorAll("strong");
    for (var i = 0; i < testSections.length; i++) {
      if (
        testSections[i].textContent.includes("Test Function") &&
        testSections[i].closest("table") &&
        testSections[i].closest("table").querySelector("#usertext2")
      ) {
        var container = testSections[i].closest("table");
        if (container && container.parentNode) {
          container.parentNode.insertBefore(functionDisplay, container);
          inserted = true;
          break;
        }
      }
    }

    // Fallback: insert near usertext2
    if (!inserted) {
      var userText2 = document.getElementById("usertext2");
      if (userText2) {
        var table = userText2.closest("table");
        if (table && table.parentNode) {
          table.parentNode.insertBefore(functionDisplay, table);
        }
      }
    }
  }

  functionDisplay.innerHTML = `
    <strong>🔧 Current Function F<sub>k</sub> for Part 2:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">${current_function}</code>
    <br><small>This determines how XOR (0) or EQV (1) operations are applied to each bit position in Secure CBC-MAC.</small>
  `;

  // Update required length display for Part 2
  var requiredLengthSpan = document.getElementById("required-length-secure");
  if (requiredLengthSpan) {
    requiredLengthSpan.textContent = current_l;
  }
}

function addFunctionOutputExplanationSecure() {
  // Add explanation for the Function output field in Part 2
  var functionOutput = document.getElementById("functionvalue2");
  if (functionOutput && !document.getElementById("output-explanation-secure")) {
    var explanation = document.createElement("div");
    explanation.id = "output-explanation-secure";
    explanation.style.cssText =
      "background: #e8f5e8; padding: 8px; margin: 5px 0; border-radius: 4px; font-size: 13px; border-left: 3px solid #28a745;";
    explanation.innerHTML = `
      <strong>💡 About Secure CBC-MAC Function Output:</strong> This field shows the result when you apply the cryptographic function F<sub>k</sub> to your input text in the secure CBC-MAC implementation. 
      The function uses the current function pattern and key to transform your binary input into the corresponding output.
    `;

    var table = functionOutput.closest("table");
    if (table && table.parentNode) {
      table.parentNode.insertBefore(explanation, table.nextSibling);
    }
  }
}

// =============================================================================
// ANSWER CHECKING FUNCTIONS
// =============================================================================

function CheckSecureAnswer() {
  var userAnswer = document.getElementById("outputarea2").value.trim();
  var notification = document.getElementById("notification2");

  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification2";
    notification.style.cssText =
      "padding: 10px; margin: 10px 0; font-weight: bold; border-radius: 5px; text-align: center;";

    // Find the notification div that should already exist in HTML
    var existingNotification = document.getElementById("notification2");
    if (existingNotification) {
      notification = existingNotification;
    }
  }

  // Check if user provided an answer
  if (!userAnswer) {
    notification.innerHTML =
      "⚠️ Please enter your calculated CBC-MAC result in the Final Output field.";
    notification.style.backgroundColor = "#fff3cd";
    notification.style.color = "#856404";
    notification.style.border = "1px solid #ffeaa7";
    return;
  }

  // Validate that the answer is binary
  if (!validate_binary(userAnswer)) {
    notification.innerHTML = "❌ Please enter only binary digits (0 and 1).";
    notification.style.backgroundColor = "#f8d7da";
    notification.style.color = "#721c24";
    notification.style.border = "1px solid #f5c6cb";
    return;
  }

  // Calculate the correct CBC-MAC
  try {
    var plaintext = document.getElementById("plaintext2").value;
    var key = document.getElementById("key2").value;
    var iv = document.getElementById("iv2").value;
    var l = document.getElementById("l2").value;

    if (!plaintext || !key || !iv || !l) {
      notification.innerHTML =
        "⚠️ Please ensure all parameters (plaintext, key, IV, l) are set before checking your answer.";
      notification.style.backgroundColor = "#fff3cd";
      notification.style.color = "#856404";
      notification.style.border = "1px solid #ffeaa7";
      return;
    }

    // Calculate correct CBC-MAC for secure version
    var correctMAC = calculateSecureCBCMAC(plaintext, key, iv, parseInt(l));

    if (userAnswer === correctMAC) {
      notification.innerHTML =
        "✅ Good choice! You selected: keys method for secure CBC-MAC. This helps prevent length extension and other attacks.";
      notification.style.backgroundColor = "#d4edda";
      notification.style.color = "#155724";
      notification.style.border = "1px solid #c3e6cb";
    } else {
      notification.innerHTML = `❌ Incorrect. Your answer: ${userAnswer}<br>Correct CBC-MAC: ${correctMAC}<br>💡 Tip: Follow the secure CBC-MAC algorithm step by step using the given parameters.`;
      notification.style.backgroundColor = "#f8d7da";
      notification.style.color = "#721c24";
      notification.style.border = "1px solid #f5c6cb";
    }
  } catch (error) {
    notification.innerHTML =
      "❌ Error calculating CBC-MAC. Please check your parameters and try again.";
    notification.style.backgroundColor = "#f8d7da";
    notification.style.color = "#721c24";
    notification.style.border = "1px solid #f5c6cb";
    console.error("CBC-MAC calculation error:", error);
  }
}

function calculateSecureCBCMAC(plaintext, key, iv, l) {
  // Implement secure CBC-MAC calculation
  // This is a simplified educational version

  // Pad the plaintext to a multiple of l
  var paddedText = pad_input(plaintext);

  // Resize key to match block size
  var resizedKey = resize_key(key, l);

  // Initialize with IV
  var previousBlock = iv;

  // Process each block
  var blocks = [];
  for (var i = 0; i < paddedText.length; i += l) {
    blocks.push(paddedText.substring(i, i + l));
  }

  for (var i = 0; i < blocks.length; i++) {
    var currentBlock = blocks[i];

    // XOR with previous block (or IV for first block)
    var xorResult = xor_strings(currentBlock, previousBlock);

    // Apply the cryptographic function
    var functionResult = function_value(xorResult, resizedKey);

    previousBlock = functionResult;
  }

  // For secure CBC-MAC, apply the function one more time with a different key
  // In this educational version, we'll use a modified key
  var secureKey = modifyKeyForSecurity(resizedKey);
  var finalMAC = function_value(previousBlock, secureKey);

  return finalMAC;
}

function modifyKeyForSecurity(key) {
  // Simple key modification for educational secure CBC-MAC
  // In practice, this would be a more sophisticated key derivation
  var modifiedKey = "";
  for (var i = 0; i < key.length; i++) {
    modifiedKey += key.charAt(i) === "0" ? "1" : "0"; // Simple bit flip
  }
  return modifiedKey;
}
