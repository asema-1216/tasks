import json
import os
import sqlite3
from flask import Flask, render_template, request, jsonify, redirect, url_for, g

app = Flask(__name__)
DATABASE = 'projects.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        db.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT,
                url TEXT
            )
        ''')
        db.commit()

def migrate_from_json():
    with app.app_context():
        db = get_db()
        cursor = db.execute('SELECT COUNT(*) FROM projects')
        count = cursor.fetchone()[0]
       
        if count == 0:
            json_path = os.path.join(app.root_path, 'data', 'projects.json')
            if os.path.exists(json_path):
                with open(json_path, 'r', encoding='utf-8') as f:
                    projects = json.load(f)
                    for p in projects:
                        db.execute(
                            'INSERT INTO projects (id, title, description, category, url) VALUES (?, ?, ?, ?, ?)',
                            (
                                p.get('id'),
                                p.get('title', ''),
                                p.get('description', ''),
                                p.get('category', 'Web App'),
                                p.get('url', '#')
                            )
                        )
                    db.commit()
                    print("--> Data successfully migrated from JSON to SQLite database (projects.db)!")

init_db()
migrate_from_json()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/projects')
def api_projects():
    db = get_db()
    cursor = db.execute('SELECT * FROM projects')
    rows = cursor.fetchall()

    projects = [dict(row) for row in rows]
    return jsonify(projects)

@app.route('/projects/<int:project_id>')
def project_page(project_id):
    db = get_db()
    cursor = db.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
    project = cursor.fetchone()
    
    if project is None:
        return render_template('404.html'), 404
        
    return render_template('project.html', project=dict(project))




@app.route('/projects/new', methods=['GET', 'POST'])
def new_project():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        category = request.form.get('category', 'Web App')
        url = request.form.get('url', '#')
        
        db = get_db()
        db.execute(
            'INSERT INTO projects (title, description, category, url) VALUES (?, ?, ?, ?)',
            (title, description, category, url)
        )
        db.commit()
        return redirect(url_for('home'))
        
    return render_template('new_project.html')

@app.route('/contact', methods=['POST'])
def contact():
    name = request.form.get('name', 'Guest')
    email = request.form.get('email', '')
    message = request.form.get('message', '')
    return render_template('thanks.html', name=name)

if __name__ == '__main__':
    app.run(debug=True)