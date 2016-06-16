/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mastermind;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

/**
 *
 * @author Unisinos
 */
public class MasterMind {
    private String todasCores[] = { "Verde (V)", "Azul (A)", "Marrom (M)", "Rosa (R)", "Preto (P)", "Branco (B)", "Dourado (D)" , "Lilás (L)"};
    private String coresEscolhidas[] = null;
    int fases = 0;

    public MasterMind() {
        coresEscolhidas = sorteiaCores();
    }

    public String[] getTodasCores() {
        return todasCores;
    }

    public void setTodasCores(String[] todasCores) {
        this.todasCores = todasCores;
    }

    public String[] getCoresEscolhidas() {
        return coresEscolhidas;
    }

    public void setCoresEscolhidas(String[] coresEscolhidas) {
        this.coresEscolhidas = coresEscolhidas;
    }

    public int getFases() {
        return fases;
    }

    public void setFases(int fases) {
        this.fases = fases;
    }
    
    
    
    private String[] sorteiaCores() {
        List<String> list = new ArrayList<String>(todasCores.length);
        for (String i : todasCores)
            list.add(i);   
        Collections.shuffle(list);

        String[] escolhidos = new String[4];
        for (int i = 0; i < 4; i++)
            escolhidos[i] = list.get(i);
        Arrays.sort(escolhidos);
        return escolhidos;
    }
    public void verificaCores(String coresDoUsuario[]){
        int corCertaLugarCerto = 0;
        int corCertaLugarErrado = 0;
        for (int i = 0; i < coresDoUsuario.length; i++) {
            for (int j = 0; j < coresEscolhidas.length; j++) {
                if (coresDoUsuario[i].equals(coresEscolhidas[j]) && i == j) {
                    corCertaLugarCerto++;
                }
                else if (coresDoUsuario[i].equals(coresEscolhidas[j])){
                    corCertaLugarErrado++;
                }
            }
        }
        System.out.format("Existem %d cor(es) certa(s) e no lugar certo", corCertaLugarCerto);
        System.out.format("Existem %d cor(es) certa(s) mas no lugar errado", corCertaLugarErrado);
    }
    
    public void leCores(){
        String coresDoUsuario[] = null;
        System.out.println("Escolha 4 cores de acordo com sua letra");
        for (String cor : todasCores) {
            System.out.println(cor);
        }
        Scanner scanner = new Scanner(System.in);
    }
    
}
