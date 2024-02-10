<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;


class UsersController extends Controller
{

    private $database = [];

    
    /**
     * Create a new UsersController instance.
     *
     * @return void
     */
    public function __construct()
    {
        if(Storage::exists('public/db.json')) {
            $this->database = Storage::json('public/db.json');
        }else{
            $this->persister();
        }
    }

    /**
     * updates the db.json file.
     * 
     * @return void
     */
    private function persister() {
        Storage::disk('local')->put('public/db.json', json_encode($this->database));
    }
    
    /**
     * Valid if login was sent.
     */
    private function validator($data)
    {
        return Validator::make($data, [
            'login' => 'required|string',
        ], [
            'login.required' => 'O login é obrigatório',
        ]);
    }

    private function getDataFromGithub($login){
        $response = Http::get('https://api.github.com/users/'.$login);
        return $response->json();
    }


    /**
     * Store a newly created resource in storage.
     * @OA\Post (
     *     path="/api/salvar-local?login=",
     *     description="Adicionar Usuário",
     *     @OA\Response(
     *      response="200",
     *     ),
     *  
     *     @OA\Parameter(
     *          @OA\Schema(
     *              type="json"
     *          ),
     *     )
     * )
     */
    public function create(Request $request)
    {
        $validator = $this->validator($request->all());

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao cadastrar o usuario.',
                'erros' => $validator->errors()->all()
            ], 401);
        }

        $data = $request->only('login');
        $dataGithubUser = $this->getDataFromGithub($data['login']);
        array_push($this->database, $dataGithubUser);
        $this->persister();

        return $dataGithubUser;
    }
}
