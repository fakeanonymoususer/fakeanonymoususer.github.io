function toggleModal(modalId) {
  $('#' + modalId).toggle();
}

$(document).ready(function() {
  // This adds listen on the thead tr to reveal some info
  $(".order-table thead").on("click", function() {
    $(this).find("tr.description").toggleClass("tardis");
  });

  // Click on any button in the fixed menu on top to show the div
  $(document).on('click', '.options-button', function() {
    const modalId = $(this).data('modal-id');
    toggleModal(modalId);
  });

  $(window).on('click', function(event) {
    if ($(event.target).hasClass('modal')) {
      $('.modal').hide();
    }
  });

  // Highlighting columns
  function highlightTBodyRows(event) {
    $(event.currentTarget).closest('table')
      .find('tbody tr')
      .toggleClass('highlighted', event.type === 'mouseenter');
  }

  $('thead').on('mouseenter mouseleave', highlightTBodyRows);

  // This adds and remove the text in the top menu
  const notViableParagraph = $('#not_viable');
  const yesViableParagraph = $('#yes_viable');
  const tables_normal = $('.order-table.normal');
  const tables_opposite = $('.order-table.opposite');

  function updateParagraphs() {
    notViableParagraph.text('Cannot use:');
    yesViableParagraph.text('Can use:');

    tables_normal.each(function() {
      const headerText = $(this).find('thead tr:first-child th:first-child').text().trim();
      const display = $(this).css('display');

      if (display === 'none') {
        notViableParagraph.text((i, text) => text + ` ${headerText}`);
      } else {
        yesViableParagraph.text((i, text) => text + ` ${headerText}`);
      }
    });
    tables_opposite.each(function() {
      const headerText = $(this).find('thead tr:first-child th:first-child').text().trim();
      const display = $(this).css('display');

      if (display !== 'none') {
        notViableParagraph.text((i, text) => text + ` ${headerText}`);
      } else {
        yesViableParagraph.text((i, text) => text + ` ${headerText}`);
      }
    });
  }

  updateParagraphs();

  // Observer configuration
  const observerConfig = {
    attributes: true,
    attributeFilter: ['style'],
  };

  const observerCallback = function(mutationsList) {
    for (const mutation of mutationsList) {
      if ($(mutation.target).hasClass('order-table')) {
        updateParagraphs();
        break;
      }
    }
  };

  const observer = new MutationObserver(observerCallback);
  tables_normal.each(function() {
    observer.observe(this, observerConfig);
  });
  tables_opposite.each(function() {
    observer.observe(this, observerConfig);
  });

/* Search for .order-table and .normal */
  $('.light-table-filter').on('input', function() {
    const searchTerm = $(this).val().trim().toLowerCase();
    
    $('.order-table').each(function() {
      const $table = $(this);
      const $tbody = $table.find('tbody');
      let allRowsHidden = true;

      $tbody.find('tr').each(function() {
        const rowText = $(this).text().toLowerCase();
        const shouldHide = rowText.indexOf(searchTerm) === -1;
        $(this).toggle(!shouldHide);

        // Check if any row is visible
        if (!shouldHide) {
          allRowsHidden = false;
        }
      });

      // Toggle the table based on row visibility
      $table.toggle(!allRowsHidden);
    });
  });
});