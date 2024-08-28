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

    // Notification Settings
    document.querySelector('#notification-settings form').addEventListener('submit', function(event) {
        event.preventDefault();
        // Handle notification settings save logic here
        alert('Notifications et alertes sauvegardées');
    });
});

// Support and Help
function contactSupport() {
    // Handle contact support logic here
    alert('Contactez le support à support@votresite.com ou appelez le 01 23 45 67 89');
}

// JavaScript for handling settings

// JavaScript for handling settings

// JavaScript for handling settings

document.addEventListener('DOMContentLoaded', function() {
    // Profile Settings
    document.querySelector('#profile-settings form').addEventListener('submit', function(event) {
        event.preventDefault();
        // Handle profile settings save logic here
        alert('Profil sauvegardé');
    });
});

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

function setCursorToEnd(field) {
    field.focus();
    var length = field.value.length;
    field.setSelectionRange(length, length);
}