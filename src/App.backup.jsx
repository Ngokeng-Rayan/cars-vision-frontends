import { Routes, Route } from 'react-router-dom'

// VERSION DE SECOURS - TESTE SI REACT FONCTIONNE
function App() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                maxWidth: '600px',
                textAlign: 'center'
            }}>
                <h1 style={{ color: '#4DB896', fontSize: '32px', marginBottom: '20px' }}>
                    ✅ React Fonctionne !
                </h1>
                <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '30px' }}>
                    Si tu vois ce message, React et React Router fonctionnent correctement.
                </p>

                <div style={{
                    backgroundColor: '#fef3c7',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ color: '#92400e', fontSize: '20px', marginBottom: '10px' }}>
                        ⚠️ Diagnostic
                    </h2>
                    <p style={{ color: '#78350f', fontSize: '14px' }}>
                        Le problème de page blanche vient probablement d'un composant spécifique.
                    </p>
                </div>

                <Routes>
                    <Route path="/" element={
                        <div style={{
                            backgroundColor: '#d1fae5',
                            padding: '15px',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}>
                            <p style={{ color: '#065f46', fontWeight: 'bold' }}>
                                ✅ Route "/" fonctionne
                            </p>
                        </div>
                    } />

                    <Route path="/test" element={
                        <div style={{
                            backgroundColor: '#dbeafe',
                            padding: '15px',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}>
                            <p style={{ color: '#1e40af', fontWeight: 'bold' }}>
                                ✅ Route "/test" fonctionne
                            </p>
                        </div>
                    } />
                </Routes>

                <div style={{ marginTop: '30px', fontSize: '14px', color: '#9ca3af' }}>
                    <p>Serveur: http://localhost:5175</p>
                    <p>Pour tester: Va sur http://localhost:5175/test</p>
                </div>
            </div>
        </div>
    )
}

export default App
