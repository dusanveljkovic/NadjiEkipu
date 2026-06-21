# Nadji Ekipu

Web aplikacija za povezivanje ljudi sa sličnim interesovanjima i organizovanje zajedničkih aktivnosti.

## Opis projekta

Nadji Ekipu je platforma koja omogućava korisnicima da pronađu ljude za različite aktivnosti, kao što su fudbal, košarka, šah, zajedničko učenje ...

Korisnici mogu:
- da pregledaju i kreiraju aktivnosti  
- da se prijave na postojeće događaje  
- da komuniciraju sa drugim učesnicima putem chata  

Cilj aplikacije je da olakša organizaciju i povezivanje ljudi sa sličnim interesovanjima.

## Pokretanje projekta

```bash
# frontend
npm install
npm run dev

# backend 
python -m pip install -r requirements.txt

docker run -d --name redis -p 6379:6379 redis:alpine
docker run -d \
    --name mariadb \
    -e MYSQL_ROOT_PASSWORD=rootpassword \
    -e MYSQL_DATABASE=nadji_ekipu \
    -e MYSQL_USER=myuser \
    -e MYSQL_PASSWORD=mypasswod \
    -p 3306:3306 \
    mariadb:latest
docker exec -i mariadb mysql -u root -p rootpassword nadjiekipu < ../baza/create_db.sql
docker exec -i mariadb mysql -u root -p rootpassword nadjiekipu < ../baza/seed.sql

python manage.py runserver
```

## Tehnologije

- Frontend: React + Tailwind CSS  
- Backend: Python (Django)  
- Baza: MySQL  
- Eksterni API: OpenWeather API  

## Checklist (progress tracker)
🟥 - nije uradjeno
🟦 - napravljeno u prototipu
🟨 - uradjen ceo back ili front
🟩 - funkcionalnost kompletirana

### Autentifikacija
- 🟦 Registracija korisnika  
- 🟩 Login  
- 🟦 Logout  
- 🟥 Role-based autorizacija  

### Profil
- 🟩 Pregled profila  
- 🟥 Izmena podataka  
- 🟦 Promena lozinke  

### Interesovanja
- 🟩 Dodavanje interesovanja  
- 🟩 Izmena interesovanja  
- 🟩 Skill level  

### Aktivnosti
- 🟦 Kreiranje aktivnosti  
- 🟦 Prijava na aktivnost  
- 🟩 Prikaz aktivnosti
- 🟦 Brisanje aktivnosti
- 🟥 Preporučene aktivnosti  

### Pretraga i filteri
- 🟩 Pretraga po interesovanju
- 🟩 Filter po vremenu i datumu
- 🟩 Filter po lokaciji  

### Chat
- 🟩 Prikaz svi chetova za korisnika
- 🟩 Chat između učesnika  
- 🟥 Automatsko brisanje chata  

### Moderator
- 🟥 Dodavanje interesovanja  
- 🟥 Brisanje interesovanja  

### Administrator
- 🟩 Pregled korisnika  
- 🟩 Brisanje korisnika  
- 🟩 Dodela moderatora  
- 🟩 Pregled statistike  

### Napredno
- 🟥 Integracija OpenWeather API  
- 🟥 Preporuke po vremenu  
- 🟥 Mapa aktivnosti  
- 🟥 Napredni filteri  

