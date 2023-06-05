import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, List, Modal, PaperProvider, Portal, Text, TextInput } from "react-native-paper";

export default function Home(){
    const [user, setUser] = useState({
        name: 'Ana',
        email: ''
    })
    const [toDo, setToDo] = useState(false)
    const [cards, setCards] = useState([{title: "Praia", description: "Eu gosto de ir a praia", category: "ea", image: "https://st.depositphotos.com/1010338/2099/i/600/depositphotos_20999947-stock-photo-tropical-island-with-palms.jpg"}])
    const [select, setSelect] = useState('')
    const [categories, setCategories] = useState(["ea", "eaeeae"])
    const [filter, setFilter] = useState('')
    const [note, setNote] = useState({
      title: '',
      description: '',
      category: ''
    })

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
                     onPress={() => {
                        
                     }}
                  >Adicione</Button>
               </Modal> 
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
        }
    })