document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#profile-settings form').addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Profil utilisateur sauvegardé');
    });

    document.querySelector('#account-preferences form').addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Préférences de compte sauvegardées');
    });

    document.querySelector('#security-settings form').addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Paramètres de sécurité sauvegardés');
    });
});

function enableEdit(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.readOnly = false;
        field.classList.add('editable');

        if (field.type === 'password') {
            field.type = 'text';
        }

        field.focus();
        const length = field.value.length;
        field.setSelectionRange(length, length);

        if (fieldId === 'username') {
            field.addEventListener('input', function () {
                const usernameModified = document.getElementById('username-modified');
                if (usernameModified) {
                    usernameModified.style.display = 'block';
                }
            });
        }
    }
}


function setCursorToEnd(field) {
    field.focus();
    var length = field.value.length;
    field.setSelectionRange(length, length);
}