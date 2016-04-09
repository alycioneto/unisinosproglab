public class CoelhoDaPascoa {
    private Teclado t = new Teclado();
    private int ovosSemLactose, criancas ,criancasIntolerantes ;
    public void ovosSemLactose (){
        this.ovosSemLactose = t.leInt ("Quantos ovos sem lactose o coelho possui para entregar: ");
        if(ovosSemLactose >= 10){
            this.ovosSemLactose = t.leInt("Digite novamente quantos ovos sem lactose o coelho possui para entregar: : ");
        }
    }
    public void criancasTemQueReceberOvos(){
        this.criancas = t.leInt ("Quantas crianças devem receber os ovos: ");
        this.criancasIntolerantes = t.leInt ("Quantas crianças são intolerantes à lactose: ");
        if( criancasIntolerantes > criancas){
            System.out.println("Valor não pode ultrapassar o numero de crianças.");
            this.criancasIntolerantes = t.leInt ("Quantas crianças são intolerantes à lactose: ");
        }
        
    }
    public void entregarOvos(){
        ovosSemLactose();
        criancasTemQueReceberOvos();
        int semOvos = criancasIntolerantes - ovosSemLactose;
        while (criancas != 0){
        char c = t.leChar("Criança é intolerante?");
        if (c == 's' && ovosSemLactose > 0 ){
            criancas--;
            criancasIntolerantes--;
            ovosSemLactose--;
            System.out.println("Ovo sem Lactose Entregue");
        }
        else if (c == 's' && ovosSemLactose == 0)
            System.out.println("Os Ovos sem lactose Acabaram");
        else{
            System.out.println("Ovo de pascoa Entregue");
            criancas--;
        }
        }
        System.out.println(semOvos + "crianças não receberam ovos sem Lactose!!");
    }
}
