$(document).ready(function(argument) {

    $('#menu #menu-toggle').click(function(argument) {
        $('#menu #menu-buttons').toggle();
        $('#menu #menu-toggle').toggleClass('change');
    });


    $('#charges .empty').click(function(argument) {
        $(this).parent().prev().find('input[type="checkbox"]').each(function(argument) {
            $(this).prop("checked", false);
        });
        // Trigger autosave
        if (typeof triggerAutoSave === 'function') {
            triggerAutoSave();
        }
    });

    $('#charges .fill').click(function(argument) {
        var maxInput = $(this).parent().prev().find('input.charge-max');
        var checkboxes = $(this).parent().prev().find('input[type="checkbox"]');
        var maxChecks = 10; // Default to all 10
        
        if (maxInput.length > 0 && maxInput.val()) {
            maxChecks = parseInt(maxInput.val()) || 10;
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