import { Button, Input, Form } from '../components/common'

function Test() {
  return (
    <div>
      <h1>Page de Test - Sandbox</h1>

      <h2>Buttons</h2>
      <Button variant="main">Main</Button>
      <Button variant="secondary">Secondary</Button>

      <h2>Inputs</h2>
      <Input type="text" label="Texte" placeholder="Entrez du texte" />
      <Input type="email" label="Email" placeholder="exemple@email.com" />
      <Input type="password" label="Mot de passe" placeholder="••••••••" />
      <Input type="search" label="Recherche" placeholder="Rechercher..." />
      <Input
        type="select"
        label="Catégorie"
        placeholder="Sélectionnez..."
        options={[
          { value: 'cpu', label: 'Processeur' },
          { value: 'gpu', label: 'Carte Graphique' },
          { value: 'ram', label: 'RAM' }
        ]}
      />

      <h2>Form - Connexion</h2>
      <Form
        fields={[
          { name: 'email', type: 'email', label: 'Email', placeholder: 'exemple@email.com' },
          { name: 'password', type: 'password', label: 'Mot de passe', placeholder: '••••••••' }
        ]}
        primaryButton={{ label: 'Se connecter' }}
        secondaryButton={{ label: 'Annuler' }}
        onSubmit={(values) => console.log('Form values:', values)}
      />

      <h2>Form - Étapes</h2>
      <Form
        fields={[
          { name: 'nom', type: 'text', label: 'Nom', placeholder: 'Votre nom' },
          { name: 'prenom', type: 'text', label: 'Prénom', placeholder: 'Votre prénom' }
        ]}
        primaryButton={{ label: 'Suivant' }}
        secondaryButton={{ label: 'Précédent' }}
        onSubmit={(values) => console.log('Form values:', values)}
      />
    </div>
  )
}

export default Test
