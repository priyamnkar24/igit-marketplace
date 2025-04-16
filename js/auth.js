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
<<<<<<< HEAD
});
=======

  const usernameForm = document.getElementById('username-form');
  if (usernameForm) {
    usernameForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newUsername = (document.getElementById('new-username') || document.getElementById('username-input')).value;
      const { data: { user } } = await supabase.auth.getUser();

      const { data: existingUsername } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', newUsername)
        .single();

      if (existingUsername) {
        alert('Username already taken!');
        return;
      }

      await supabase.from('profiles').update({ username: newUsername }).eq('id', user.id);

      document.getElementById('username-popup')?.style.display = 'none';
      document.getElementById('popup-overlay')?.style.display = 'none';
      const profileName = document.querySelectorAll('#profile-name, #profile-dropdown-name');
      profileName.forEach(p => p.textContent = newUsername);
      if (window.location.pathname.includes('signup.html')) {
        window.location.href = 'profile.html';
      } else {
        alert('Username updated successfully!');
      }
    });
  }

  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });
  }

  const uploadForm = document.getElementById('upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const file = document.getElementById('avatar-upload').files[0];
      if (!file) return alert('Please select an image');

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${supabase.auth.user().id}/${file.name}`, file, { upsert: true });

      if (error) {
        console.error('Upload error:', error.message);
        return alert('Error uploading image');
      }

      const { publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${supabase.auth.user().id}/${file.name}`);

      await supabase.from('profiles').update({ avatar_url: publicURL }).eq('id', supabase.auth.user().id);
      document.querySelectorAll('.profile-pic').forEach(img => img.src = publicURL);
      alert('Profile picture updated successfully!');
    });
  }

  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const year = document.getElementById('year').value;
      const branch = document.getElementById('branch').value;
      const hostel = document.getElementById('hostel').value;
      await supabase.from('profiles').update({ year, branch, hostel }).eq('id', supabase.auth.user().id);
      alert('Profile updated!');
    });
  }
});

function showUsernamePopup() {
  const popup = document.getElementById('username-popup');
  const overlay = document.getElementById('popup-overlay');
  if (popup && overlay) {
    popup.style.display = 'block';
    overlay.style.display = 'block';
    gsap.from(popup, { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' });
  }
}

const googleLogin = document.getElementById('google-login');
if (googleLogin) {
  googleLogin.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://priyamkar24.github.io/igit-marketplace/profile.html' // Update this
      }
    });

    if (error) {
      console.error('Google login error:', error.message);
      alert('Google login failed: ' + error.message);
    }
  });
}
>>>>>>> 724ffed3f1cae4584108c09ad0a38a1ffa88da19
