/* Click button, makes modal div */
function toggleModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal.style.display === 'block') {
    modal.style.display = 'none';
  } else {
    modal.style.display = 'block';
  }
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}
/* Adds listener to header, to explain some stuff when needed */
function toggleTableRows(event) {
  const thead = event.currentTarget;
  const trElements = thead.querySelectorAll("tr");
  for (let i = 1; i < trElements.length; i++) {
    trElements[i].classList.toggle("tardis");
  }
}

const tables = document.querySelectorAll(".order-table");
tables.forEach((table) => {
  table.querySelectorAll("thead").forEach((thead) => {
    thead.addEventListener("click", toggleTableRows);
  });
});

/* Highlighting */
(function() {
  'use strict';

  var highlightedRows = new Set();

  function highlightRelatedRows(event) {
    var hoveredRow = event.target.closest('tr');
    if (!hoveredRow) return;

    var parentTable = hoveredRow.closest('table');
    if (!parentTable) return;

    if (parentTable.contains(hoveredRow) && parentTable.tHead.contains(hoveredRow)) {
      return;
    }

    var rowIndex = Array.from(hoveredRow.parentNode.children).indexOf(hoveredRow);

    var tables = document.getElementsByTagName('table');
    Array.from(tables).forEach(function(table) {
      var tbodies = table.getElementsByTagName('tbody');
      Array.from(tbodies).forEach(function(tbody) {
        var rows = tbody.getElementsByTagName('tr');
        Array.from(rows).forEach(function(row, index) {
          if (index === rowIndex) {
            row.classList.add('highlighted');
            highlightedRows.add(row);
          } else {
            row.classList.remove('highlighted');
            highlightedRows.delete(row);
          }
        });
      });
    });
  }

  function highlightPage(event) {
    var hoveredRow = event.target.closest('tr');
    if (hoveredRow === event.currentTarget) {
      document.body.classList.add('highlighted-page');
    } else {
      document.body.classList.remove('highlighted-page');
    }
  }

  function removeHighlight() {
    highlightedRows.forEach(function(row) {
      row.classList.remove('highlighted');
    });

    highlightedRows.clear();

    document.body.classList.remove('highlighted-page');
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('mouseover', highlightRelatedRows);
    document.body.addEventListener('mouseout', removeHighlight);
    document.body.addEventListener('mouseenter', highlightPage);
    document.body.addEventListener('mouseleave', highlightPage);
  });
})();

(function() {
  'use strict';

  function highlightTBodyRows(event) {
    var thead = event.currentTarget;
    var table = thead.closest('table');

    if (!table) return;

    var tbody = table.querySelector('tbody');
    if (!tbody) return;

    var tbodyRows = tbody.getElementsByTagName('tr');
    for (var i = 0; i < tbodyRows.length; i++) {
      tbodyRows[i].classList.toggle('highlighted', event.type === 'mouseenter');
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var theads = document.getElementsByTagName('thead');
    for (var i = 0; i < theads.length; i++) {
      theads[i].addEventListener('mouseenter', highlightTBodyRows);
      theads[i].addEventListener('mouseleave', highlightTBodyRows);
    }
  });
})();
/* */

(function(document) {
  'use strict';
  console.log("script.js loaded");
  /* Table search JS */
  var LightTableFilter = (function(Arr) {
    let _input;
    let _originalRows = new Map();

    function _onInputEvent(e) {
      _input = e.target;
      var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
      Arr.forEach.call(tables, function(table) {
        var tbody = table.querySelector('tbody');

        if (tbody === null) {
          return; 
        }

        if (!_originalRows.has(table)) {
          _originalRows.set(table, Array.from(tbody.rows));
        }

        if (_input.value === '') {
          _restoreOriginalRows(table, tbody);
        } else {
          _filterRows(tbody, _input.value.toLowerCase());
          _checkParentTableVisibility(table); 
        }
      });
    }

    function _filterRows(tbody, filterValue) {
      var visibleRows = [];
      Arr.forEach.call(tbody.rows, function(row) {
        var text = row.textContent.toLowerCase();
        var isValid = text.indexOf(filterValue) !== -1;

        if (isValid) {
          // Restore the row if it matches the search term
          row.style.display = 'table-row';
          visibleRows.push(row);
        } else {
          // Check for exemption class in ancestor nodes of the row
          var ancestor = row.parentElement;
          var isExempt = false;
          while (ancestor) {
            if (ancestor.nodeType === Node.ELEMENT_NODE && ancestor.classList.contains('exemption')) {
              isExempt = true;
              break;
            }
            ancestor = ancestor.parentElement;
          }

          if (!isExempt) {
            row.style.display = 'none';
          }
        }
      });

      tbody.innerHTML = '';
      visibleRows.forEach(function(row) {
        tbody.appendChild(row);
      });
    }

    function _checkParentTableVisibility(table) {
      var tbody = table.querySelector('tbody');
      if (tbody === null) {
        return;
      }

      var rows = tbody.querySelectorAll('tr');
      var allRowsHidden = true;

      Arr.forEach.call(rows, function(row) {
        if (row.style.display !== 'none') {
          allRowsHidden = false;
          return;
        }
      });

      if (allRowsHidden) {
        table.style.display = 'none';
      } else {
        table.style.display = 'flex';
      }
    }

    function _restoreOriginalRows(table, tbody) {
      if (tbody === null) {
        return;
      }

      if (!_originalRows.has(table)) {
        return;
      }

      tbody.innerHTML = ''; // Clear current tbody content
      _originalRows.get(table).forEach(function(originalRow) {
        originalRow.style.display = 'table-row'; // Ensure the row is visible when restored
        tbody.appendChild(originalRow.cloneNode(true)); // Restore the original rows (cloning to avoid reference issues)
      });

      _checkParentTableVisibility(table); // Check and hide parent table if needed
    }

    return {
      init: function() {
        var inputs = document.getElementsByClassName('light-table-filter');
        Arr.forEach.call(inputs, function(input) {
          input.oninput = _onInputEvent;

          // Listen to the input event on the search input to check if the input value is empty
          input.addEventListener('input', function() {
            var table = document.querySelector(input.getAttribute('data-table'));
            var tbody = table ? table.querySelector('tbody') : null;
            if (input.value === '') {
              _restoreOriginalRows(table, tbody);
            }
          });
        });
      },
      _restoreOriginalRows: _restoreOriginalRows // Make _restoreOriginalRows accessible outside the closure
    };
  })(Array.prototype);

  document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
      LightTableFilter.init();
    }
  });
})(document);


function updateTableStatus() {
  const notViableParagraph = document.getElementById('not_viable');
  const yesViableParagraph = document.getElementById('yes_viable');

  const tables = document.querySelectorAll('.order-table');

  function updateParagraphs() {
    notViableParagraph.textContent = 'Cannot use:';
    yesViableParagraph.textContent = 'Can use:';
    
    for (const table of tables) {
      const tableHeader = table.querySelector('thead tr th');
      if (!tableHeader) continue;
      
      const headerText = tableHeader.textContent.trim();
      if (getComputedStyle(table).display === 'none') {
        notViableParagraph.textContent += ` ${headerText}`;
      } else {
        yesViableParagraph.textContent += ` ${headerText}`;
      }
    }
  }

  // Update paragraphs initially
  updateParagraphs();

  // Observer configuration
  const observerConfig = {
    attributes: true,
    attributeFilter: ['style'],
  };

  // Callback function to handle DOM changes
  const observerCallback = function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.target.classList.contains('order-table')) {
        updateParagraphs();
        break;
      }
    }
  };

  // Create and start the MutationObserver
  const observer = new MutationObserver(observerCallback);
  tables.forEach((table) => observer.observe(table, observerConfig));
}

updateTableStatus();