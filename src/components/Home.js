import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, List, Modal, PaperProvider, Portal, Text, TextInput } from "react-native-paper";

export default function Home(){
    const [user, setUser] = useState({
        name: 'Ana',
        email: ''
    })
    const [toDo, setToDo] = useState(false)
    const [cards, setCards] = useState([])
    const [select, setSelect] = useState('')
    const [categories, setCategories] = useState(["ea", "eaeeae"])
    const [filter, setFilter] = useState('')
    const [note, setNote] = useState({
      title: '',
      description: '',
      category: '',
      image: ''
    })

   async function createNotes(){
      await axios.post('http://localhost:5000/notes', {
         title: note.title,
         description: note.description,
         category: note.category,
         image: note.image
      }, {})
      await getCategories()
   }

   async function getCategories(){
      const {data} = await axios.get('http://localhost:5000/notes', {})
      setCards(data)
   }

   useEffect(async () => {
      await getCategories()
   }, [])

   console.log(cards)

    return (
        <View style={styles.homeContainer}>
         <PaperProvider>
            <Portal>
               <View style={styles.headerContainer}>
                  <Text variant='titleLarge'>Olá, {user.name}! Oque faremos hoje?</Text>
                  <ScrollView style={styles.inputContainer}>
                     <Button onPress={() => setToDo(true)} icon={"plus"} mode="contained"></Button>
                  </ScrollView>
               </View>
               {toDo ? <View style={styles.homeContainer2}
                  onDismiss={() => {
                     setToDo(false)
                     setNote({
                        title: '',
                        description: '',
                     })}}
               >
                  <Modal visible={toDo} onDismiss={() => {
                     setToDo(false)
                     setNote({
                        title: '',
                        description: '',
                     })
                     setSelect('')
                     }} contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
                     <TextInput
                        mode="outlined"
                        label="Título"
                        value={note.title}
                        placeholder="Meu bloquinho..."
                        onChangeText={(e) => { 
                           setNote({...note, title: e})
                           console.log(note)
                        }}
                     />
                     
                     <TextInput
                        mode="outlined"
                        label="Descrição"
                        dense="4dp"
                        placeholder="Neste bloco..."
                        style={{height: 150}}
                        multiline={true}
                        onChangeText={(e) => { 
                           setNote({...note, description: e})
                           console.log(note)
                        }}
                     />
                     <List.Section>
                        <List.Accordion
                        title="Categoria"
                        left={props => <List.Icon {...props} icon="folder" />}>
                           {categories.map((category, index) => {
                              return(
                                 <List.Item 
                                    key={index} 
                                    title={category}
                                    backgroundColor={select === category ? "#E8E6E3" : "white"}
                                    onPress={() => {
                                       setSelect(category)
                                       setNote({...note, category: category})
                                       console.log(note)
                                    }}
                                 />
                              )
                           })}
                        </List.Accordion>
                     </List.Section>
                     <Button
                        onPress={async () => {
                           await createNotes()
                        }}
                     >Adicione</Button>
                  </Modal>
               </View> : null} 
               <List.Section>
                  <List.Accordion
                  title="Selecione a Categoria"
                  left={props => <List.Icon {...props} icon="folder" />}>
                     {categories.map((category, index) => {
                        return(
                           <List.Item 
                              key={index} 
                              title={category}
                              backgroundColor={filter === category ? "#E8E6E3" : "white"}
                              onPress={() => {
                                 setFilter(category === filter ? '' : category)
                              }}
                           />
                        )
                     })}
                  </List.Accordion>
               </List.Section>
               {cards.map((card) => {
                  if(card.category !== filter && filter !== ''){
                     return
                  }
                  return(
                     <Card>
                        <Card.Title title={card.title}/>
                        <Card.Content>
                           <Text variant="bodyMedium">{card.description}</Text>
                        </Card.Content>
                        {card.image ? <Card.Cover source={{ uri: card.image}} /> : null}
                        <Card.Actions>
                           <Button>Remover</Button>
                           <Button>Editar</Button>
                        </Card.Actions>
                     </Card>
                  )
               })}
            </Portal>
         </PaperProvider>
        </View>
    )
}

const styles = StyleSheet.create({
        headers: {
            fontSize: 26,
        },
        headerContainer: {
            margin: 20
        },
        inputToDo:{
            width: "80%"
        },
        inputContainer: {
            display: "flex",
            marginTop: 20,
        },
        homeContainer:{
            height: "100%"
        },
        homeContainer2:{
            position: "absolute",
            height: "100%",
            width: "100%",
            zIndex: 1
        }
    })