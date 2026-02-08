$(document).ready(function(argument) {

    $('#menu #menu-toggle').click(function(argument) {
        $('#menu #menu-buttons').toggle();
        $('#menu #menu-toggle').toggleClass('change');
    });

    // Function to update checkbox visibility based on max value
    function updateCheckboxVisibility(chargeDiv) {
        var maxInput = $(chargeDiv).find('input.charge-max');
        var checkboxes = $(chargeDiv).find('input[type="checkbox"]');
        var maxChecks = 0; // Default to 0 (no checkboxes shown)
        
        if (maxInput.length > 0 && maxInput.val()) {
            maxChecks = parseInt(maxInput.val()) || 0;
            // Ensure maxChecks is between 0 and 10
            maxChecks = Math.max(0, Math.min(10, maxChecks));
        }
        
        // Show/hide checkboxes based on max value
        checkboxes.each(function(index) {
            if (index < maxChecks) {
                $(this).show();
            } else {
                $(this).hide();
                $(this).prop("checked", false); // Uncheck hidden boxes
            }
        });
    }

    // Initialize checkbox visibility for all charge divs on page load
    $('#charges-container .charge-row').each(function() {
        updateCheckboxVisibility(this);
    });

    // Update checkbox visibility when max value changes
    $('#charges-container').on('input change', 'input.charge-max', function() {
        var chargeDiv = $(this).closest('.charge-row');
        updateCheckboxVisibility(chargeDiv);
        // Trigger autosave
        if (typeof triggerAutoSave === 'function') {
            triggerAutoSave();
        }
    });

    $('#charges-container').on('click', '.empty', function(argument) {
        $(this).parent().find('input[type="checkbox"]').each(function(argument) {
            $(this).prop("checked", false);
        });
        // Trigger autosave
        if (typeof triggerAutoSave === 'function') {
            triggerAutoSave();
        }
    });

    $('#charges-container').on('click', '.fill', function(argument) {
        var chargeDiv = $(this).parent();
        var maxInput = chargeDiv.find('input.charge-max');
        var checkboxes = chargeDiv.find('input[type="checkbox"]');
        var maxChecks = 0; // Default to 0
        
        if (maxInput.length > 0 && maxInput.val()) {
            maxChecks = parseInt(maxInput.val()) || 0;
            maxChecks = Math.max(0, Math.min(10, maxChecks));
        }
        
        checkboxes.each(function(index) {
            if (index < maxChecks) {
                $(this).prop("checked", true);
            }
        });
        // Trigger autosave
        if (typeof triggerAutoSave === 'function') {
            triggerAutoSave();
        }
    });
});