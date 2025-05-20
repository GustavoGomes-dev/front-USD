import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  Jogo,
  fetchJogos,
  addJogo,
  updateJogo,
  deleteJogo,
} from '../services/api';

export default function JogosList() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [busca, setBusca] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState<'add' | 'edit' | null>(null);
  const [jogoSelecionado, setJogoSelecionado] = useState<Jogo | null>(null);

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [classificacao, setClassificacao] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [jogoParaExcluir, setJogoParaExcluir] = useState<Jogo | null>(null);

  useEffect(() => {
    carregarJogos();
  }, []);

  const carregarJogos = () => {
    fetchJogos()
      .then(data => setJogos(data))
      .catch(err => console.error('Erro ao buscar jogos', err));
  };

  const abrirModalAdd = () => {
    limparCampos();
    setModalTipo('add');
    setModalVisible(true);
  };

  const abrirModalEdit = (jogo: Jogo) => {
    setJogoSelecionado(jogo);
    setNome(jogo.nome);
    setCategoria(jogo.categoria);
    setPlataforma(jogo.plataforma);
    setClassificacao(jogo.classificacao);
    setImgUrl(jogo.imgUrl);
    setModalTipo('edit');
    setModalVisible(true);
  };

  const limparCampos = () => {
    setNome('');
    setCategoria('');
    setPlataforma('');
    setClassificacao('');
    setImgUrl('');
    setJogoSelecionado(null);
  };

  const salvarJogo = async () => {
    if (!nome || !categoria || !plataforma || !classificacao || !imgUrl) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      if (modalTipo === 'add') {
        await addJogo({ nome, categoria, plataforma, classificacao, imgUrl });
      } else if (modalTipo === 'edit' && jogoSelecionado) {
        await updateJogo(jogoSelecionado.id, {
          nome,
          categoria,
          plataforma,
          classificacao,
          imgUrl,
        });
      }
      setModalVisible(false);
      carregarJogos();
      limparCampos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o jogo');
      console.error(error);
    }
  };

  const confirmarExcluir = (jogo: Jogo) => {
    setJogoParaExcluir(jogo);
    setModalExcluirVisible(true);
  };

  const excluirJogo = async (id: number) => {
    try {
      await deleteJogo(id);
      carregarJogos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o jogo');
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: Jogo }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imgUrl }} style={styles.imagem} />
      <View style={styles.info}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.texto}>{item.categoria}</Text>
        <Text style={styles.texto}>{item.plataforma}</Text>
        <Text style={styles.texto}>⭐ {item.classificacao}</Text>
      </View>
      <View style={styles.icones}>
        <TouchableOpacity onPress={() => abrirModalEdit(item)} style={{ marginBottom: 10 }}>
          <Feather name="edit" size={20} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmarExcluir(item)}>
          <Feather name="trash-2" size={20} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>U$D GAMES</Text>
      <Text style={styles.subtitulo}>CATÁLOGO DE JOGOS</Text>

      <View style={styles.pesquisaContainer}>
        <Feather name="search" size={20} color="#ccc" />
        <TextInput
          placeholder="Pesquisar jogo..."
          placeholderTextColor="#ccc"
          style={styles.input}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <TouchableOpacity style={styles.botao} onPress={abrirModalAdd}>
        <Text style={styles.botaoTexto}>Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        data={jogos.filter(j =>
          j.nome?.toLowerCase().includes(busca.toLowerCase())
        )}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal Adicionar/Editar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>
              {modalTipo === 'add' ? 'Adicionar Jogo' : 'Editar Jogo'}
            </Text>

            <TextInput
              placeholder="Nome"
              style={styles.modalInput}
              value={nome}
              onChangeText={setNome}
              placeholderTextColor="#ccc"
            />
            <TextInput
              placeholder="Categoria"
              style={styles.modalInput}
              value={categoria}
              onChangeText={setCategoria}
              placeholderTextColor="#ccc"
            />
            <TextInput
              placeholder="Plataforma"
              style={styles.modalInput}
              value={plataforma}
              onChangeText={setPlataforma}
              placeholderTextColor="#ccc"
            />
            <TextInput
              placeholder="Classificação"
              style={styles.modalInput}
              value={classificacao}
              onChangeText={setClassificacao}
              placeholderTextColor="#ccc"
              keyboardType="numeric"
            />
            <TextInput
              placeholder="URL da Imagem"
              style={styles.modalInput}
              value={imgUrl}
              onChangeText={setImgUrl}
              placeholderTextColor="#ccc"
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.botao, { flex: 1, marginRight: 5 }]}
                onPress={salvarJogo}
              >
                <Text style={styles.botaoTexto}>
                  {modalTipo === 'add' ? 'Adicionar' : 'Salvar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoCancelar, { flex: 1, marginLeft: 5 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.botaoTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalExcluirVisible}
        onRequestClose={() => setModalExcluirVisible(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Confirmar Exclusão</Text>
            <Text style={{ color: 'white', marginBottom: 20 }}>
              Tem certeza que deseja excluir "{jogoParaExcluir?.nome}"?
            </Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.botao, { flex: 1, marginRight: 5 }]}
                onPress={() => {
                  if (jogoParaExcluir) excluirJogo(jogoParaExcluir.id);
                  setModalExcluirVisible(false);
                }}
              >
                <Text style={styles.botaoTexto}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoCancelar, { flex: 1, marginLeft: 5 }]}
                onPress={() => setModalExcluirVisible(false)}
              >
                <Text style={styles.botaoTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a23',
    padding: 20,
    paddingTop: 50,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitulo: {
    fontSize: 18,
    color: 'white',
    marginBottom: 15,
  },
  pesquisaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1b3a',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: 'white',
    marginLeft: 10,
    height: 40,
  },
  botao: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    alignItems: 'center',
  },
  imagem: {
    width: 100,
    height: 150,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  texto: {
    color: '#555',
  },
  icones: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(10,10,35,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#0a0a23',
    borderRadius: 15,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: '#1b1b3a',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
  },
  modalBotoes: {
    flexDirection: 'row',
    marginTop: 10,
  },
  botaoCancelar: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
});
