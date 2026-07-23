import json
import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def load_projects_data():
    json_path = os.path.join(app.root_path, 'data', 'projects.json')
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/projects')
def api_projects():
    projects = load_projects_data()
    return jsonify(projects)

@app.route('/projects/<int:project_id>')
def project_page(project_id):
    projects = load_projects_data()
    project = next((p for p in projects if p.get('id') == project_id), None)
    
    if not project:
        return render_template('404.html'), 404
        
    return render_template('project.html', project=project)

@app.route('/contact', methods=['POST'])
def contact():
    name = request.form.get('name', 'Guest')
    email = request.form.get('email', '')
    message = request.form.get('message', '')
    
    print(f"Received message from {name} ({email}): {message}")
    
    return render_template('thanks.html', name=name)

if __name__ == '__main__':
    app.run(debug=True, port=5000)