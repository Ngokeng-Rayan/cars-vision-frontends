import { Routes, Route } from 'react-router-dom'

// Version simplifiée pour tester
function App() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>🎉 Test - Application Fonctionne !</h1>
            <p>Si tu vois ce message, React fonctionne correctement.</p>
            <p>Le problème vient probablement d'un composant spécifique.</p>

            <Routes>
                <Route path="/" element={
                    <div>
                        <h2>Page d'accueil</h2>
                        <p>Route "/" fonctionne ✅</p>
                    </div>
                } />

                <Route path="/test" element={
                    <div>
                        <h2>Page de test</h2>
                        <p>Route "/test" fonctionne ✅</p>
                    </div>
                } />
            </Routes>
        </div>
    )
}

export default App
