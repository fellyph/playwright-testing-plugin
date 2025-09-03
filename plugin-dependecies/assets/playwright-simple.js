jQuery(document).ready(function($) {
    // Fake data storage
    let messages = [];
    
    // Load messages from localStorage
    function loadMessages() {
        const stored = localStorage.getItem('playwright_messages');
        messages = stored ? JSON.parse(stored) : [];
        displayMessages();
    }
    
    // Save messages to localStorage
    function saveMessages() {
        localStorage.setItem('playwright_messages', JSON.stringify(messages));
    }
    
    // Display messages
    function displayMessages() {
        const $list = $('#messages-list');
        if (messages.length === 0) {
            $list.html('<p>No messages yet.</p>');
            return;
        }
        
        let html = '<table class="wp-list-table widefat fixed striped"><thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Date</th></tr></thead><tbody>';
        messages.forEach(function(msg) {
            html += `<tr><td>${msg.name}</td><td>${msg.email}</td><td>${msg.message}</td><td>${msg.date}</td></tr>`;
        });
        html += '</tbody></table>';
        $list.html(html);
    }
    
    // Handle form submission
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        
        const name = $('#name').val();
        const email = $('#email').val();
        const message = $('#message').val();
        
        if (!name || !email || !message) {
            alert('All fields are required.');
            return;
        }
        
        if (!email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Add message to fake storage
        messages.unshift({
            name: name,
            email: email,
            message: message,
            date: new Date().toLocaleString()
        });
        
        saveMessages();
        displayMessages();
        this.reset();
        
        // Show success message
        $('<div class="notice notice-success"><p>Message sent successfully!</p></div>')
            .insertAfter('#contact-form')
            .delay(3000)
            .fadeOut();
    });
    
    // Add fake data
    $('#add-fake-data').on('click', function() {
        const fakeData = [
            { name: 'John Doe', email: 'john@example.com', message: 'Hello from John!' },
            { name: 'Jane Smith', email: 'jane@example.com', message: 'Greetings from Jane!' },
            { name: 'Bob Johnson', email: 'bob@example.com', message: 'Hi from Bob!' }
        ];
        
        fakeData.forEach(function(data) {
            messages.unshift({
                ...data,
                date: new Date().toLocaleString()
            });
        });
        
        saveMessages();
        displayMessages();
    });
    
    // Clear messages
    $('#clear-messages').on('click', function() {
        if (confirm('Are you sure you want to clear all messages?')) {
            messages = [];
            saveMessages();
            displayMessages();
        }
    });
    
    // Initialize
    loadMessages();
});
