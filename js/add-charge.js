$(document).ready(function() {

    // Add new charge resource
    $('#add-charge-btn').click(function() {
        var newChargeRow = `
            <div class="charge-row w3-col w3-padding">
                <button class="button move-up w3-button w3-blue-gray w3-round-large"><i class="fa fa-arrow-up"></i></button>
                <button class="button move-down w3-button w3-blue-gray w3-round-large"><i class="fa fa-arrow-down"></i></button>
                <input type="text" class="charge-name" placeholder="Name" />
                <input type="text" class="charge-max" maxlength="2" size="2" placeholder="Max" title="Max charges (leave empty for 10)" />
                <button class="button fill w3-button w3-blue-gray w3-round-large">Fill</button>
                <button class="button empty w3-button w3-blue-gray w3-round-large">Empty</button>
                <input type="checkbox" name="1" />
                <input type="checkbox" name="2" />
                <input type="checkbox" name="3" />
                <input type="checkbox" name="4" />
                <input type="checkbox" name="5" />
                <input type="checkbox" name="6" />
                <input type="checkbox" name="7" />
                <input type="checkbox" name="8" />
                <input type="checkbox" name="9" />
                <input type="checkbox" name="10" />
                <button class="button remove-charge w3-button w3-blue-gray w3-round-large"><i class="fa fa-trash"></i></button>
            </div>
        `;
        
        $(newChargeRow).insertBefore($('#add-charge-btn').parent());
        
        // Trigger autosave
        if (typeof triggerAutoSave === 'function') {
            triggerAutoSave();
        }
    });

    // Remove charge resource
    $('#charges-container').on('click', '.remove-charge', function() {
        $(this).parent().remove();
        
        // Trigger autosave
        if (typeof triggerAutoSave === 'function') {
            triggerAutoSave();
        }
    });

    // Move charge up
    $('#charges-container').on('click', '.move-up', function() {
        var row = $(this).parent();
        var prev = row.prev('.charge-row');
        if (prev.length) {
            row.insertBefore(prev);
            
            // Trigger autosave
            if (typeof triggerAutoSave === 'function') {
                triggerAutoSave();
            }
        }
    });

    // Move charge down
    $('#charges-container').on('click', '.move-down', function() {
        var row = $(this).parent();
        var next = row.next('.charge-row');
        if (next.length) {
            row.insertAfter(next);
            
            // Trigger autosave
            if (typeof triggerAutoSave === 'function') {
                triggerAutoSave();
            }
        }
    });

});
