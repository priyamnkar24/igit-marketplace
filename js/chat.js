document.addEventListener('DOMContentLoaded', () => {
  const supabase = Supabase.createClient(
    'https://acumblomcsqqdnzvgtoj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdW1ibG9tY3NxcWRuenZndG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjMyNTIsImV4cCI6MjA2MDI5OTI1Mn0.rB0iufdofpEDeqopbJGgMy5TNsfBS7zaE2EIZkHKL7Q'
  );

  const loadChats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: messages } = await supabase.from('messages').select('chat_key, sender');
    const users = new Set();
    messages.forEach(msg => {
      const [user1, user2] = msg.chat_key.split('-');
      if (user1 === user.email) users.add(user2);
      if (user2 === user.email) users.add(user1);
    });

    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';
    for (let email of users) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('email', email)
        .single();
      const div = document.createElement('div');
      div.className = 'chat-user';
      div.textContent = profile.username || email;
      div.addEventListener('click', () => loadMessages(email));
      chatList.appendChild(div);
    }
  };

  const loadMessages = async (otherUser) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('email', otherUser)
      .single();
    document.getElementById('chat-with').textContent = `Chat with ${profile.username || otherUser}`;
    const chatKey = [user.email, otherUser].sort().join('-');

    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_key', chatKey)
      .order('created_at', { ascending: true });

    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    messages.forEach(msg => {
      const div = document.createElement('div');
      div.className = `message ${msg.sender === user.email ? 'sender' : 'receiver'}`;
      div.textContent = msg.text;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    localStorage.setItem('chatWith', otherUser);
  };

  loadChats();

  const chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = document.getElementById('message').value;
      const otherUser = localStorage.getItem('chatWith');
      const { data: { user } } = await supabase.auth.getUser();

      const chatKey = [user.email, otherUser].sort().join('-');
      await supabase.from('messages').insert([{ chat_key: chatKey, sender: user.email, text: message }]);
      document.getElementById('message').value = '';
      loadMessages(otherUser);
    });
  }

  const chatWith = localStorage.getItem('chatWith');
  if (chatWith) loadMessages(chatWith);
});
