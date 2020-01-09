const axios = require( 'axios' )
const cheerio = require( 'cherio' )
const cheerioTableparser = require('cheerio-tableparser')
const numberPattern = /\d+/g
const anoAtual = 2020

const mapearPosicaoFM = posicao => {
    posicao = posicao.split(',')[0]
  
    if (posicao.includes('D/')) {
      let lado = posicao.split(' ')[1]
  
      if (lado == 'L') {
        return 'LE'
      } else if (lado == 'R') {
        return 'LD'
      } else {
        return 'LATERAL DECIDIR LADO'
      }
    }
  
    switch (posicao) {
      case 'GK':
        return 'GK'
      case 'D C':
      case 'D RC':
      case 'D LC':
        return 'ZG'
      case 'D RLC':
        return 'DEFENSOR JOGA EM TODASSSS'
      case 'D R':
      case 'WB R':
        return 'LD'
      case 'D L':
      case 'WB L':
        return 'LE'
      case 'DM':
      case 'M C':
        return 'VL'
      case 'AM':
      case 'AM C':
        return 'MA'
      case 'AM L':
      case 'AM LC':
        return 'PE'
      case 'AM R':
      case 'AM RC':
        return 'PD'
      case 'AM RL':
        return 'PONTA JOGA EM ALGUM LADO'
      case 'AM RLC':
        return 'MEIA TODOS OS SETORES'
      case 'ST':
        return 'CA'
      default:
        return 'SEI LÁAAAAAAA'
    }
  }

const obterPaises = async () => {
    const paisesResponse = await axios.get( 'https://sortitoutsi.net/football-manager-2020/database')
    const $ = cheerio.load( paisesResponse.data )
    cheerioTableparser( $ )

    const data = $( '.table-striped' ).parsetable( )
    const listaDePaises = []
    const listaSimplificada = [ data[ 1 ], data[ 3 ] ]
    const tamanhoSublista = listaSimplificada[1].length
    for (let index = 0; index < tamanhoSublista; index++) {
        const link = listaSimplificada[ 0 ][ index ]
        const reputacao = listaSimplificada[ 1 ][ index ].match( numberPattern )
        if ( link && reputacao ) {
            const element = { 
                link: link.substring( link.indexOf( "https" ), link.indexOf( `">\n` ) ), 
                reputacao: reputacao[ 0 ]
            }
            listaDePaises.push( element )
        }
    }
    return listaDePaises.sort( ( a , b )  => b.reputacao - a.reputacao ).slice( 0, 14 )
}

const obterLigas = async () => {
    const principaisPaises = await obterPaises()
    const map = principaisPaises.map( async element => {
        const ligasResponse = await axios.get( element.link )
        const $ = cheerio.load( ligasResponse.data )
        cheerioTableparser( $ )

        const data = $( '.leagues-table .table-striped' ).parsetable( )
        const listaDePaises = []
        const listaSimplificada = [ data[ 1 ], data[ 9 ] ]
        const tamanhoSublista = listaSimplificada[1].length
        for (let index = 0; index < tamanhoSublista; index++) {
            const link = listaSimplificada[ 0 ][ index ]
            const reputacao = listaSimplificada[ 1 ][ index ].match( numberPattern )
            if ( link && reputacao ) {
                const element = { 
                    link: link.substring( link.indexOf( "https" ), link.indexOf( `">\n` ) ), 
                    reputacao: reputacao[ 0 ]
                }
                listaDePaises.push( element )
            }
        }
        const a = listaDePaises.sort( ( a , b )  => b.reputacao - a.reputacao ).slice( 0, 1 )
        return a[ 0 ]
    })
    const promiseResolvida = await Promise.all( map )
    return promiseResolvida
}

const obterTimes = async () => {
    const principaisPaises = await obterLigas()
    const map = principaisPaises.map( async element => {
        const ligasResponse = await axios.get( element.link )
        const $ = cheerio.load( ligasResponse.data )
        cheerioTableparser( $ )

        const data = $( '.teams-table .table-striped' ).parsetable( )
        const listaSimplificada = data[ 1 ]
        const listaDePaises = listaSimplificada.map(element => {
            return { link: element.substring( element.indexOf( "https" ), element.indexOf( `">\n` ) ) }
        });
        return listaDePaises
    })
    const promiseResolvida = await Promise.all( map )
    return promiseResolvida.reduce( ( acc, val ) => acc.concat( val ), [] )
}

const obterJogadores = async () => {
    const principaisTimes = await obterTimes()
    const map = principaisTimes.map( async element => {
        const jogadoresResponse = await axios.get( element.link )
        const $ = cheerio.load( jogadoresResponse.data )
        cheerioTableparser( $ )

        const data = $( '.player-table .table-striped' ).parsetable( )
        const nomes = data[ 1 ].map( el => el.substring( el.indexOf( 'title="' ), el.indexOf( 'href="https:' ) ).replace( 'title=', '' ) )
        const idades = data[ 2 ].map( el => anoAtual - Number( el.replace( '\n', '' ).trim() ) )
        const posicoes = data[ 3 ].map( el => mapearPosicaoFM( el.replace('\n', '').trim() ) )
        const overalls = data[ 8 ].map( el => el.substring( el.indexOf( 'title="' ), el.indexOf( '">\n            <span class="number">\n' ) ).replace( 'title=', '' ) )
        const tamanhoSublista = nomes.length
        const listaJogadores = []
        for (let index = 0; index < tamanhoSublista; index++) {
            const nome = nomes[ index ]
            const idade = idades[ index ]
            const posicao = posicoes[ index ]
            const overall = overalls[ index ]
            if ( nome && idade && posicao && overall ) {
                const jogador = { nome, idade, posicao, overall }
                listaJogadores.push( jogador )
                console.log( jogador )
            }
        }
        return listaJogadores
    })
    const promiseResolvida = await Promise.all( map )
    const listaJogadoresFlat = promiseResolvida.reduce( ( acc, val ) => acc.concat( val ), [] )
    return listaJogadoresFlat
}

obterJogadores()
