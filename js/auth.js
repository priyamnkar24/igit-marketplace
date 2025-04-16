document.addEventListener('DOMContentLoaded', () => {
  const supabase = Supabase.createClient(
    'https://acumblomcsqqdnzvgtoj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdW1ibG9tY3NxcWRuenZndG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjMyNTIsImV4cCI6MjA2MDI5OTI1Mn0.rB0iufdofpEDeqopbJGgMy5TNsfBS7zaE2EIZkHKL7Q'
  );

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      window.location.href = 'profile.html';
    } else if (!window.location.pathname.includes('login.html')) {
      window.location.href = 'login.html';
    }
  };

  checkSession();

  const googleLogin = document.getElementById('google-login');
  if (googleLogin) {
    googleLogin.addEventListener('click', async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://igitmarketplace.shop/profile.html'
        }
      });

      if (error) {
        console.error('Google login error:', error.message);
        alert('Google login failed: ' + error.message);
      }
    });
  }
});