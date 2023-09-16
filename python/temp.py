# Ouvrir les fichiers et lire les mots
with open("data/francais_10000.txt", "r") as f1, open("data/ods6.txt", "r") as f2:
    words1 = f1.read().splitlines()
    words2 = f2.read().splitlines()

# Convertir en minuscules pour la comparaison
words2_lower = set(w.lower() for w in words2)

# Filtrer les mots du fichier 1
filtered_words = [word for word in words1 if word.lower() in words2_lower]

# Réécrire le fichier 1
with open("data/francais_10000_2.txt", "w") as f1:
    for word in filtered_words:
        f1.write(f"{word.upper()}\n")
