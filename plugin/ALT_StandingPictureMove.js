//=============================================================================
// ALT_StandingPictureMove.js
// by Altered (Machina Suzuhara)
// Version: 1.01
//=============================================================================

/*:
 * @plugindesc 簡略立繪功能
 * @author Altered
 *
 * @param default_position_y
 * @desc 顯示立繪圖像時，通過該值調整位置（高度）
 * 該值適用於此插件顯示的所有立繪圖
 * @default 450
 *
 * @param Stand_1_PictureNumber
 * @desc "立繪01"指定圖片編號
 * @default 1
 *
 * @param Stand_1_CharacterName
 * @desc "立繪01"設置指令名稱
 * @default Rabbit_01
 *
 * @param Stand_1_FileName
 * @desc 插件命令"Stand_1"時要調用的圖片名稱
 * @default Package1_1
 *
 * @param Stand_2_PictureNumber
 * @desc "立繪02"指定圖片編號
 * @default 2
 *
 * @param Stand_2_CharacterName
 * @desc "立繪02"設置指令名稱
 * @default Rabbit_02
 *
 * @param Stand_2_FileName
 * @desc 插件命令"Stand_2"時要調用的圖片名稱
 * @default Package1_2
 *
 * @param Stand_3_PictureNumber
 * @desc "立繪03"指定圖片編號
 * @default 3
 *
 * @param Stand_3_CharacterName
 * @desc "立繪03"設置指令名稱
 * @default Rabbit_03
 *
 * @param Stand_3_FileName
 * @desc 插件命令"Stand_3"時要調用的圖片名稱
 * @default Package1_3
 *
 * @param Stand_4_PictureNumber
 * @desc "立繪04"指定圖片編號
 * @default 4
 *
 * @param Stand_4_CharacterName
 * @desc "立繪04"設置指令名稱
 * @default Rabbit_04
 *
 * @param Stand_4_FileName
 * @desc 插件命令"Stand_4"時要調用的圖片名稱
 * @default Package1_4
 *
 * @param Stand_5_PictureNumber
 * @desc "立繪05"指定圖片編號
 * @default 5
 *
 * @param Stand_5_CharacterName
 * @desc "立繪05"設置指令名稱
 * @default Rabbit_05
 *
 * @param Stand_5_FileName
 * @desc 插件命令"Stand_5"時要調用的圖片名稱
 * @default Package1_5
 *
 * @param Stand_6_PictureNumber
 * @desc "立繪06"指定圖片編號
 *
 * @param Stand_6_CharacterName
 * @desc "立繪06"設置指令名稱
 *
 * @param Stand_6_FileName
 * @desc 插件命令"Stand_6"時要調用的圖片名稱
 *
 * @param Stand_7_PictureNumber
 * @desc "立繪07"指定圖片編號
 *
 * @param Stand_7_CharacterName
 * @desc "立繪07"設置指令名稱
 *
 * @param Stand_7_FileName
 * @desc 插件命令"Stand_7"時要調用的圖片名稱
 *
 * @param Stand_8_PictureNumber
 * @desc "立繪08"指定圖片編號
 *
 * @param Stand_8_CharacterName
 * @desc "立繪08"設置指令名稱
 *
 * @param Stand_8_FileName
 * @desc 插件命令"Stand_8"時要調用的圖片名稱
 *
 * @param Stand_9_PictureNumber
 * @desc "立繪09"指定圖片編號
 *
 * @param Stand_9_CharacterName
 * @desc "立繪09"設置指令名稱
 *
 * @param Stand_9_FileName
 * @desc 插件命令"Stand_9"時要調用的圖片名稱
 *
 * @param Stand_10_PictureNumber
 * @desc "立繪10"指定圖片編號
 *
 * @param Stand_10_CharacterName
 * @desc "立繪10"設置指令名稱
 *
 * @param Stand_10_FileName
 * @desc 插件命令"Stand_10"時要調用的圖片名稱
 *
 *
 * @help イベントコマンドの「プラグインコマンド」を使って立ち絵を表示・非表示させたり、
 *立ち絵に簡単なスライドアニメをさせます。
 *
 *--------------------------------------------------------------------------------------------------------------------------
 *
 * 【利用規約】
 * 1.利用上の注意
 * ・本スクリプトを使用してゲームなどを配布する際、
 *   添付ドキュメント内に本素材を使用して制作した旨を表記し、その際に次の権利表記を行なうこと。
 *
 *  (C)Altered  http://altered.sblo.jp
 *
 *   ※但し、「http://altered.sblo.jp」はR-18サイトのため、表記は配布者の任意としますが、
 *    本素材を使用した配布物が内容を問わずR-18指定の場合、表記は必須とします。
 *
 * ・有償、無償、年齢制限コンテンツでの利用に、特に制限はありません。
 *
 * ・利用に関しては全て自己責任で行ってください。
 *   本スクリプトを使用すること及びゲームなどを制作・配布・販売することにより、
 *   第三者との間で生じたトラブル等に関しては、本素材作成者は一切責任を負わないものとします。
 *
 * ・素材制作者に許可無く改変可。改変物の配布時には、
 *   添付ドキュメント内に本素材を使用して制作した旨を表記し、その際に次の権利表記を行なうこと。
 *
 *  (C)Altered  http://altered.sblo.jp
 *
 *   ※但し、「http://altered.sblo.jp」はR-18サイトのため、表記は配布者の任意としますが、
 *    本素材を使用した配布物が内容を問わずR-18指定の場合、表記は必須とします。
 *
 * 2.利用報告
 * ・特に必要ありません。
 *
 * 3.禁止事項
 * ・素材単体での二次配布。
 * ・素材への直リンク。
 *
 *  4.サポート
 * ・競合などの対処は致しかねますので、予めご了承下さい。
 *
 *--------------------------------------------------------------------------------------------------------------------------
 *
 * 【注意事項】
 * ・立ち絵画像の解像度の、縦横どちらか一方、もしくが両方が奇数の場合、
 *   拡大率100％でも表示した立ち絵画像がぼやけてしまう事がありますのでご注意下さい。
 *
 * ・画面解像度が、「816*624」「1024*768」「1280*960」以外の場合、
 *   スライドアニメが綺麗に表示されない場合があります。
 *
 * ・一度表示した立ち絵は、イベントコマンドの「ピクチャの移動」で対応するピクチャ番号を入力すれば動かせます。
 *   同様に、「ピクチャの消去」「ピクチャの回転」「ピクチャの色調変更」「ピクチャの消去」も使えます。
 *
 *
 * 【プラグインコマンド記述の仕方】
 * <記述1>
 * SPM キャラ名 立ち位置 スライド 時間 x y x％ y％ ウェイトありorなし
 *
 * <記述2>
 * SPM キャラ名 消去 時間 ウェイトありorなし
 *
 * ※1 それぞれの項目は半角スペースで区切って下さい。
 * ※2 キャラ名、ピクチャ番号、画像ファイル名の登録は、
 * 　　プラグイン管理画面のパラメータで予め設定しておいて下さい。
 * ※3 記述1で立ち絵が非表示になっても、ピクチャの透明度が0になっただけで画面上には存在しています。
 * 　　ピクチャを画面上から消去する場合は、任意のタイミングでイベントコマンド「ピクチャの消去」を実行して下さい。
 *
 *
 *
 * 【記述項目の説明】
 * <SPM>
 * 這是一個調用這個插件的描述。 一定要把它寫在頂部，不要改變它。
 *
 * <檔案名稱>
 * 如果您在此處輸入要顯示站立圖片的字符名稱，
 * 顯示使用插件管理屏幕參數設置的立體圖像。
 *
 * <立ち位置>
 * 立ち絵を表示させたい位置を記述。
 * 　　　Left…………立ち絵を画面の左側に表示させます。
 * 　　　Right…………立ち絵を画面の左側に表示させます。
 * 　　　Central………立ち絵を画面の中央に表示させます。
 * 　　　With………最後に表示した立ち位置に表示させます。
 * 　　　　　　　　※ゲームを再起動すると、"前回"の位置情報は消去されます。
 * 　　　　　　　　　ゲーム起動後、初めて表示させる際に"前回"を記述すると何も表示されません。
 *
 * <スライド> slide
 * 立ち絵が表示される際のスライドアニメの種類を記述。
 * 　　　no………スライドせずに表示されます。
 * 　　　1st………在向中心滑動時淡入淡出。
 * 　　　　　　　　根據站立位置，是否自動判斷是否向右或向左滑動。
 * 　　　2nd……在滑出屏幕時淡出。
 * 　　　　　　　　根據站立位置，是否自動判斷是否向右或向左滑動。
 *
 * <時間> Time
 * "スライド"の項目で設定したスライドアニメの処理時間（≒スライド＆フェード速度）を記述。
 * 値を"時間"と記述すると、各スライドパターン毎にオーソドックスな処理時間が自動で代入されます。
 *
 * <x>
 * 立ち位置で設定した位置に加え、ここに記述した値の分、さらに横方向に移動します。
 * 画面左に移動させる場合はマイナスの値を記述して下さい。
 *
 * <y>
 * プラグイン管理画面のパラメータ「default_position_y」で設定した画像の高さに加え、
 * ここに記述した値の分、さらに縦方向に移動します。
 * 画面上に移動させる場合はマイナスの値を記述して下さい。
 *
 * <x％>
 * 立ち絵画像の横の拡大率を指定します。
 * 画像を左右反転させる場合は<x％>に-100と記述して下さい。
 * 反転させる場合は画像の位置が線対称になるので、"x"項目で位置を調整して下さい。
 *
 * <y％>
 * 立ち絵画像の縦の拡大率を指定します。
 * 画像を上下逆さにする場合は<y％>に-100と記述して下さい。
 * 上下逆さにする場合は画像の位置が線対称になるので、"y"項目で位置を調整して下さい。
 *
 * <Erase>
 * プラグインコマンドで指定したキャラ名の立ち絵画像を、非表示にする。
 *
 * <ウェイトありorなし>
 * スライドアニメやフェード処理をしている間、他の処理をウェイトするかどうかを指定します。
 * 　　　With_weight……立ち絵のスライドアニメやフェード処理が終わるまで他の処理は待機します。
 * 　　　No_weight……立ち絵のスライドアニメやフェード処理と他の処理が並列処理されます。 
 *
 * ※プラグインコマンド記述の際、
 * 　"立ち位置" "スライド" "時間" "x" "y" "x％" "y％"の項目は、
 * 　その項目名のまま記述すると、デフォルト値として下記の値が各項目に代入されます。
 *
 * <デフォルト値>
 * 立ち位置 = 前回
 * スライド = なし
 * 時間 = スライドの種類に合わせてデフォルトで設定している値
 * 　　　　　　例）スライドの項目を"イン"と記述した場合、値は"10"が自動で代入される。
 * x = 0
 * y = 0
 * x％ = 100
 * y％ = 100
 *
 *
 *
 * 【使用例】
 * ▼例1▼
 * SPM Rabbit_01 Left 1st 30 -25 y x％ y％ No_weight
 *
 * 処理内容 :
 * プラグイン管理画面で設定したアルドに対応する画像ファイルが、同じくアルドに対応するピクチャ番号で、
 * 画面左側から30フーレムかけて中央に向かって少しスライドしながらフェードインし、
 * 最終立ち位置がプリセットの左側の立ち位置よりさらに左に25ドット寄っている。
 * （表示開始位置も左に25ドット寄った状態で開始される）
 * 以上の処理は、次の処理と並列に実行される。
 *
 * ▼例2▼
 * SPM Rabbit_01 Erase 60 No_weight
 * SPM Cat_01 Erase 60 With_weight
 *
 * 処理内容 :
 * プラグイン管理画面で設定したアルドとニナそれぞれに対応するピクチャ番号の画像が、
 * 画面上から60フレームかけて同時にフェードアウトする。
 *
 *
 */

(function() {

    var parameters = PluginManager.parameters('ALT_StandingPictureMove');

//パラメータをオブジェクトに格納

    var _default_position_y = String(parameters['default_position_y'] || 0);
    var default_position_y = _default_position_y - 0

    $Stand_Character_FileName_obj = {};
    $Stand_Character_PictureNumber_obj = {};
    $SPM_Pic_x_obj = {};
    $SPM_Pic_y_obj = {};
    $SPM_Pic_Scale_x_obj = {};
    $SPM_Pic_Scale_y_obj = {};
    $SPM_Pic_Opacity_obj = {};
    $SPM_Pic_Position_obj = {};


      var SPM_NameNumber = 0;
      for (var i = 0; i < 16; i++){
        SPM_NameNumber++;
        var _Stand_CharacterName = 'Stand_' + SPM_NameNumber + '_CharacterName';
        var _Stand_FileName = 'Stand_' + SPM_NameNumber + '_FileName';
        var _Stand_PictureNumber = 'Stand_' + SPM_NameNumber + '_PictureNumber';
        var Stand_CharacterName = String(parameters[_Stand_CharacterName]);
        var Stand_FileName = String(parameters[_Stand_FileName]);
        var Stand_PictureNumber = String(parameters[_Stand_PictureNumber]);
        $Stand_Character_FileName_obj[Stand_CharacterName] = Stand_FileName;
        $Stand_Character_PictureNumber_obj[Stand_CharacterName] = Stand_PictureNumber;
      }



    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'SPM') {


        //初期設定
        var SPM_Id = $Stand_Character_PictureNumber_obj[args[0]];
        var SPM_FileName = $Stand_Character_FileName_obj[args[0]];
        var SPM_Position = args[1];
        var _SPM_Position;


        var SPM_x = 0;
        var SPM_y = 0;


        //消去以外の処理
        if (SPM_Position !== 'Erase') {
            if (args[4] === 'x') {
              args[4] = 0;
            }
            args[4] = args[4] - 0;

            switch (SPM_Position) {
                case 'Pos':
                SPM_x = Graphics.width / 2 - Graphics.width / 3 + args[4];
                break;
                case 'Right':
                SPM_x = Graphics.width / 2 + Graphics.width / 3 + args[4];
                break;
                case 'Left':
                SPM_x = Graphics.width / 2 - Graphics.width / 3 + args[4];
                break;
                case 'Central':
                SPM_x = Graphics.width / 2 + args[4];
                break;
                case 'With':
                SPM_x = $SPM_Pic_x_obj[SPM_Id] + args[4];
                break;
            }
            SPM_x = Math.round(SPM_x);

            if (args[5] === 'y') {
              args[5] = 0;
            }
            args[5] = args[5] - 0;
            SPM_y = args[5] + default_position_y;

            if (args[6] === 'x％') {
              args[6] = 100;
            }
            args[6] = args[6] - 0;
            SPM_Scale_x = args[6];

            if (args[7] === 'y％') {
              args[7] = 100;
            }
            args[7] = args[7] - 0;
            SPM_Scale_y = args[7];


            //スライドアニメの初期設定
            var SPM_GraphicsWidth = Graphics.width;
            var SPM_GraphicCoefficient = 0
            switch (SPM_GraphicsWidth) {
              case 816:
              SPM_GraphicCoefficient = 1;
              break;
              case 1024:
              SPM_GraphicCoefficient = 1.25;
              break;
              case 1280:
              SPM_GraphicCoefficient = 1.5;
              break;
            }

            var SPM_x_move = SPM_x;
            var SPM_y_move = SPM_y;
            var SPM_Scale_x_move = SPM_Scale_x;
            var SPM_Scale_y_move = SPM_Scale_y;
            var SPM_Opacity;
            var SPM_Duration;
            var SPM_SlidePattern = args[2];

            //スライドアニメの設定
            switch (SPM_SlidePattern) {
            case 'slide':
                  switch (SPM_Position) {
                      case 'With':
                        _SPM_Position = $SPM_Pic_Position_obj[SPM_Id]
                      break;
                  }
                  SPM_Opacity = 0;
                  SPM_Opacity_move = 255;
                  if (args[3] === 'Time') {
                    SPM_Duration = 10;
                  }else if (args[3] !== 'Time') {
                    SPM_Duration = args[3];
                  }
                  break;

            case 'no':
                  switch (SPM_Position) {
                      case 'With':
                        _SPM_Position = $SPM_Pic_Position_obj[SPM_Id]
                      break;
                  }
                  SPM_Opacity = 0;
                  SPM_Opacity_move = 255;
                  if (args[3] === 'Time') {
                    SPM_Duration = 10;
                  }else if (args[3] !== 'Time') {
                    SPM_Duration = args[3];
                  }
                  break;


            case '1st':
                  switch (SPM_Position) {
                      case 'Pos':
                      SPM_x += -10 * SPM_GraphicCoefficient;
                      break;
                      case 'Right':
                      SPM_x += +10 * SPM_GraphicCoefficient;
                      break;
                      case 'Left':
                      SPM_x += -10 * SPM_GraphicCoefficient;
                      break;
                      case 'Central':
                      alert("定位置以外でスライドさせたい場合は、立ち位置を'右'（or'左'）にして、プラグインコマンドの'x'に値を入れて調整して下さい")
                      break;
                      case 'With':
                        _SPM_Position = $SPM_Pic_Position_obj[SPM_Id]
                        switch (_SPM_Position) {
                          case 'Pos':
                          SPM_x_move += +10 * SPM_GraphicCoefficient;
                          break;
                          case 'Left':
                          SPM_x_move += -10 * SPM_GraphicCoefficient;
                          break;
                          case 'Right':
                          SPM_x_move += +10 * SPM_GraphicCoefficient;
                          break;
                          case 'Central':
                          alert("定位置以外でスライドさせたい場合は、立ち位置を'右'（or'左'）にして、プラグインコマンドの'x'に値を入れて調整して下さい")
                          break;
                        }
                      break;
                  }
                  SPM_x_move = Math.round(SPM_x_move);

                  SPM_Opacity = 0;
                  SPM_Opacity_move = 255;
                  if (args[3] === 'Time') {
                    SPM_Duration = 10;
                  }else if (args[3] !== 'Time') {
                    SPM_Duration = args[3];
                  }
                  break;

            case '2nd':
                  switch (SPM_Position) {
                      case 'Pos':
                      SPM_x_move += -10 * SPM_GraphicCoefficient;
                      break;
                      case 'Right':
                      SPM_x_move += +10 * SPM_GraphicCoefficient;
                      break;
                      case 'Left':
                      SPM_x_move += -10 * SPM_GraphicCoefficient;
                      break;
                      case 'Central':
                      alert("定位置以外でスライドさせたい場合は、立ち位置を'右'（or'左'）にして、プラグインコマンドの'x'に値を入れて調整して下さい")
                      break;
                      case 'With':
                        _SPM_Position = $SPM_Pic_Position_obj[SPM_Id]
                        switch (_SPM_Position) {
                          case 'Pos':
                          SPM_x_move += -10 * SPM_GraphicCoefficient;
                          break;
                          case 'Left':
                          SPM_x_move += +10 * SPM_GraphicCoefficient;
                          break;
                          case 'Right':
                          SPM_x_move += -10 * SPM_GraphicCoefficient;
                          break;
                          case 'Central':
                          alert("定位置以外でスライドさせたい場合は、立ち位置を'右'（or'左'）にして、プラグインコマンドの'x'に値を入れて調整して下さい")
                          break;
                        }
                      break;
                  }
                  SPM_x_move = Math.round(SPM_x_move);

                  SPM_Opacity = 255;
                  SPM_Opacity_move = 0;
                  if (args[3] === 'Time') {
                    SPM_Duration = 10;
                  }else if (args[3] !== 'Time') {
                    SPM_Duration = args[3];
                  }
                  break;

            }


            //ピクチャの移動 開始時の位置
            $gameScreen.showPicture(SPM_Id, SPM_FileName, 1, SPM_x, SPM_y, SPM_Scale_x, SPM_Scale_y, SPM_Opacity, 0);

            //ピクチャの移動 終了時の位置
            $gameScreen.movePicture(SPM_Id, 1, SPM_x_move, SPM_y_move, SPM_Scale_x_move, SPM_Scale_y_move, SPM_Opacity_move, 0, SPM_Duration);
            if (args[8] === 'With_weight') {
              this.wait(SPM_Duration);
            }

            //ピクチャの移動 終了時の位置の保存
            $SPM_Pic_x_obj[SPM_Id] = SPM_x_move;
            $SPM_Pic_y_obj[SPM_Id] = SPM_y_move;
            $SPM_Pic_Scale_x_obj[SPM_Id] = SPM_Scale_x_move;
            $SPM_Pic_Scale_y_obj[SPM_Id] = SPM_Scale_y_move;
            $SPM_Pic_Opacity_obj[SPM_Id] = SPM_Opacity_move;
            if (SPM_Position === 'With') {
              SPM_Position = _SPM_Position;
            }
            $SPM_Pic_Position_obj[SPM_Id] = SPM_Position;

          }//消去以外の処理 終了

          //消去処理
          if (SPM_Position === 'Erase') {
              var SPM_Id = $Stand_Character_PictureNumber_obj[args[0]];
              var SPM_Erase_x = $SPM_Pic_x_obj[SPM_Id];
              var SPM_Erase_y = $SPM_Pic_y_obj[SPM_Id];
              var SPM_Erase_Scale_x = $SPM_Pic_Scale_x_obj[SPM_Id];
              var SPM_Erase_Scale_y = $SPM_Pic_Scale_y_obj[SPM_Id];
              _SPM_Position = $SPM_Pic_Position_obj[SPM_Id]

              if (args[2] === 'Time'){
                args[2] = 10;
              }
              var _SPM_Erase_Duration = args[2];
              var SPM_Erase_Duration = _SPM_Erase_Duration - 0;

              $gameScreen.movePicture(SPM_Id, 1, SPM_Erase_x, SPM_Erase_y, SPM_Erase_Scale_x, SPM_Erase_Scale_y, 0, 0, SPM_Erase_Duration);

              if (args[3] === 'With_weight') {
                this.wait(SPM_Erase_Duration);
              }


              //処理終了時の位置の保存
              $SPM_Pic_x_obj[SPM_Id] = SPM_Erase_x;
              $SPM_Pic_y_obj[SPM_Id] = SPM_Erase_y;
              $SPM_Pic_Scale_x_obj[SPM_Id] = SPM_Erase_Scale_x;
              $SPM_Pic_Scale_y_obj[SPM_Id] = SPM_Erase_Scale_y;
              $SPM_Pic_Opacity_obj[SPM_Id] = 0;

              if (SPM_Position === 'With') {
                SPM_Position = _SPM_Position;
              }
            }     // 消去処理  終了

          }     // if (command === 'SPM')  終了
        }     // Game_Interpreter.prototype.pluginCommand  終了

})();
