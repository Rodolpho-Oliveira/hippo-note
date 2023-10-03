import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, List, Modal, PaperProvider, Portal, Text, TextInput } from "react-native-paper";
import { API_URL } from "@env";

export default function Home(){
    const [user, setUser] = useState({
        name: 'Ana',
        email: ''
    })
    const [toDo, setToDo] = useState(false)
    const [cards, setCards] = useState([])
    const [select, setSelect] = useState('')
    const [categories, setCategories] = useState([])
    const [createCategory, setCreateCategory] = useState(false)
    const [newCategory, setNewCategory] = useState('')
    const [editCard, setEditCard] = useState(0)
    const [filter, setFilter] = useState('')
    const [note, setNote] = useState({
      title: '',
      description: '',
      categoryName: '',
      image: ''
    })

   async function createNotes(){
      await axios.post(`${API_URL}/notes`, {
         title: note.title,
         description: note.description,
         categoryName: note.categoryName,
         image: note.image
      }, {})
      await getNotes()
   }

   async function getNotes(){
      const {data} = await axios.get(`${API_URL}/notes`, {})
      setCards([...data])
      console.log(data)
   }

   async function getCategories(){
      const {data} = await axios.get(`${API_URL}/categories`, {})
      setCategories([...data])
      console.log(data)
   }

   useEffect(async () => {
      await getNotes()
      await getCategories()
   }, [])

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
                                    title={category.name}
                                    backgroundColor={select === category.name ? "#E8E6E3" : "white"}
                                    onPress={() => {
                                       setSelect(category.name)
                                       setNote({...note, categoryName: category.name})
                                    }}
                                 />
                              )
                           })}
                           <List.Item
                              title="Adicionar Categoria"
                              onPress={() => {
                                 setCreateCategory(true)
                              }}
                           />
                        </List.Accordion>
                     </List.Section>
                     <Button
                        onPress={async () => {
                           await createNotes()
                           setToDo(false)
                        }}
                     >Adicione</Button>
                  </Modal>
                  <Modal visible={createCategory} onDismiss={() => {
                     setCreateCategory(false)
                     }} contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
                        <TextInput
                        mode="outlined"
                        label="Nova Categoria"
                        dense="4dp"
                        placeholder="Categoria..."
                        style={{height: 50}}
                        onChangeText={(e) => { 
                           setNewCategory(e)
                        }}
                     />
                     <Button
                        onPress={async () => {
                           await axios.post(`${API_URL}/categories`, {
                              category: newCategory
                           }, {})
                           await getCategories()
                           setCreateCategory(false)
                           setNewCategory('')
                        }}
                     >Criar</Button>
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
                              title={category.name}
                              right={
                                 (props) => {
                                    return(
                                       <View>
                                          <Button onPress={() => {console.log("eaeaea")}} style={{height: 50}}> 
                                             <List.Icon {...props} key={index} icon="delete"/>
                                          </Button>
                                       </View>)
                                 }
                              }
                              backgroundColor={filter === category.name ? "#E8E6E3" : "white"}
                              onPress={() => {
                                 setFilter(category.name === filter ? '' : category.name)
                              }}
                           />
                        )
                     })}
                  </List.Accordion>
               </List.Section>
               {cards.map((card) => {
                  if(card.categoryName !== filter && filter !== ''){
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
                           <Button onPress={async () => {
                              await axios.delete(`${API_URL}/notes/${card.id}`, {})
                              await getNotes()
                           }}>Remover</Button>
                           <Button onPress={async () => {
                              setEditCard(card.id)
                           }}>Editar</Button>
                        </Card.Actions>
                     </Card>
                  )
               })}
               <Modal visible={editCard ? true : false}
                  onDismiss={() => {setEditCard(false)}} 
                  contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
                  <TextInput
                     mode="outlined"
                     label="Título"
                     value={note.title}
                     placeholder="Meu bloquinho..."
                     onChangeText={(e) => { 
                        setNote({...note, title: e})
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
                                 title={category.name}
                                 backgroundColor={select === category.name ? "#E8E6E3" : "white"}
                                 onPress={() => {
                                    setSelect(category.name)
                                    setNote({...note, categoryName: category.name})
                                 }}
                              />
                           )
                        })}
                        <List.Item
                           title="Adicionar Categoria"
                           onPress={() => {
                              setCreateCategory(true)
                           }}
                        />
                     </List.Accordion>
                  </List.Section>
                  <Button
                     onPress={async () => {
                        await axios.put(`${API_URL}/notes/${editCard}`, {
                           title: note.title,
                           description: note.description,
                           categoryName: note.categoryName,
                           image: note.image
                        }, {})
                        await getNotes()
                        setEditCard(false)
                     }}
                  >Editar</Button>
               </Modal>
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