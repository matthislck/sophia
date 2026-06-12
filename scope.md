Ich baue mit dir das MVP des Projekts "Sophia" 
in Plain Python. Keine Frameworks, nur requests, python-dotenv und json.

Ziel: Ein Nutzer gibt ein beliebiges Thema ein. Sophia generiert einen Skill-Tree 
(5–8 Kernkonzepte mit Abhängigkeiten) als JSON und speichert ihn lokal. 
Anschließend kann Sophia zu jedem Konzept eine Lerneinheit erzeugen (Erklärung, 
Codebeispiel, Verständnisfrage).

Projektstruktur:
- main.py          (CLI-Einstieg)
- api.py           (DeepSeek-API-Aufrufe)
- skill_tree.py    (Skill-Tree Logik: generieren, parsen, speichern)
- lesson.py        (Lektionsgenerierung, einfach)
- .env.example     (Vorlage für echte .env)
- .gitignore
- requirements.txt

Ablauf in main.py:
1. Nutzer nach Thema fragen.
2. Skill-Tree via DeepSeek generieren (prompt in skill_tree.py).
3. JSON in Datei {thema}_skilltree.json speichern.
4. Nutzer sieht die Knoten und kann eine ID eingeben, um eine Lektion zu erhalten.
5. Lektion generieren und anzeigen.

API-Modul (api.py):
- Funktion sophia_ask(prompt, system="", temperature=0.3) -> str
- Liest DEEPSEEK_API_KEY aus .env (dotenv).
- Sendet POST an https://api.deepseek.com/v1/chat/completions 
  mit model="deepseek-chat".
- Gibt response["choices"][0]["message"]["content"] zurück.

Skill-Tree (skill_tree.py):
- generate_skill_tree(topic: str) -> dict
- System-Prompt: "Du bist Sophia, eine KI, die Lernpfade in Skill-Trees organisiert."
- Prompt enthält das Topic und die JSON-Struktur, die erwartet wird.
- Robustes Parsen: Entferne eventuelle Markdown-Codeblöcke.
- Bei JSON-Fehler: Exception mit roher Antwort werfen (damit ich debuggen kann).

Lektion (lesson.py):
- generate_lesson(topic: str, node_title: str) -> dict
- Prompt enthält Thema und Konzept, erwartet JSON mit 
  {explanation, code, question}.

Jetzt baue mir exakt diese Dateien. Erstelle auch eine .env.example mit 
DEEPSEEK_API_KEY=your_key_here und ein .gitignore, das .env, __pycache__, 
und *.pyc ausschließt. requirements.txt mit requests und python-dotenv.

Nach dem Erstellen führe main.py testweise aus, indem du den Nutzer fragst und 
ein Beispielthema simulierst. Zeig mir die Ausgabe im Terminal.

alles was später auf github landen wird natürlich auf englisch also auch systemprompts