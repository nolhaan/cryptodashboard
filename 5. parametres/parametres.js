// JavaScript for handling settings

document.addEventListener('DOMContentLoaded', function() {
    // Profile Settings
    document.querySelector('#profile-settings form').addEventListener('submit', function(event) {
        event.preventDefault();
        // Handle profile settings save logic here
        alert('Profil utilisateur sauvegardé');
    });

    // Account Preferences
    document.querySelector('#account-preferences form').addEventListener('submit', function(event) {
        event.preventDefault();
        // Handle account preferences save logic here
        alert('Préférences de compte sauvegardées');
    });

    // Security Settings
    document.querySelector('#security-settings form').addEventListener('submit', function(event) {
        event.preventDefault();
        // Handle security settings save logic here
        alert('Paramètres de sécurité sauvegardés');
    });
});

// Function to enable editing of fields
function enableEdit(fieldId) {
    var field = document.getElementById(fieldId);
    field.readOnly = false;
    field.classList.add('editable');

    // If the field is a password field, change the type to text
    if (field.type === 'password') {
        field.type = 'text';
    }

    // Set the cursor at the end of the text
    setCursorToEnd(field);

    // Special handling for username field to show modification notice
    if (fieldId === 'username') {
        field.addEventListener('input', function() {
            document.getElementById('username-modified').style.display = 'block';
        });
    }
}

// Function to set the cursor at the end of the input field
function setCursorToEnd(field) {
    field.focus();
    var length = field.value.length;
    field.setSelectionRange(length, length);
}