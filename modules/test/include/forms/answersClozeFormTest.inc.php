<?php
/**
 *
 * @package
 * @author		Valerio Riva <valerio@lynxlab.com>
 * @copyright	Copyright (c) 2012, Lynx s.r.l.
 * @license		http://www.gnu.org/licenses/gpl-2.0.html GNU Public License v.2
 * @link
 * @version		0.1
 */

class AnswersClozeFormTest extends FormTest {
	protected $question;
	protected $questionObj;
	protected $data;
	protected $html;
	protected $case_sensitive;
	protected $ordine;
	protected $answers;
	protected $modifiable;

	public function __construct($data,$question,$case_sensitive = false,$modifiable = true) {
		$dh = $GLOBALS['dh'];

		$this->question = $question;
		$this->case_sensitive = $case_sensitive;
		$this->ordine = array();
		$this->answers = array();
		$this->modifiable = $modifiable;

		require_once(MODULES_TEST_PATH.'/include/nodeTest.class.inc.php');
		$this->questionObj = nodeTest::readNode($this->question);
		$res = $dh->test_getNodesByParent($this->questionObj->id_nodo);
		foreach($res as $k=>$v) {
			$this->questionObj->addChild(nodeTest::readNode($v,$this->questionObj));
		}

		$tmp = array();
		foreach($data as $k=>$v) {
			$tmp[$v['ordine']][] = $v;
		}
		parent::__construct($tmp);
	}

	protected function content() {
		require_once(MODULES_TEST_PATH.'/include/forms/controls/answerHeaderControlTest.inc.php');
		require_once(MODULES_TEST_PATH.'/include/forms/controls/answerFooterControlTest.inc.php');
		require_once(MODULES_TEST_PATH.'/include/forms/controls/answerClozeControlTest.inc.php');

		$div = CDOMElement::create('div');
		$div->setAttribute('id','clozeDiv');

		$div->addChild(new CText('<script type="text/javascript">
			document.write(\'<script type="text/javascript" src="'.MODULES_TEST_HTTP.'/js/answers_cloze.js"><\/script>\');
			document.write(\'<script type="text/javascript" src="'.MODULES_TEST_HTTP.'/js/dragdrop.js"><\/script>\')
		</script>'));

		$clozeText = preg_replace_callback(QuestionClozeTest::regexpCloze, array($this,'clozePlaceholder'), $this->question['testo']);

		$dragDropSemplicity = array(ADA_DRAGDROP_TEST_SIMPLICITY, ADA_SLOT_TEST_SIMPLICITY);
		if (in_array($this->questionObj->tipo{3},$dragDropSemplicity)) {
			$this->questionObj->buildDragDropElements($div, $clozeText, true);
			$isDragDrop = $this->questionObj->tipo{3};
		}
		else {
			$div->addChild(new CText($clozeText));
			$isDragDrop = false;
		}

		foreach($this->ordine as $i=>$ord) {
			$v = $this->data[$ord];

			$dialog = CDOMElement::create('div','id:ordine'.$ord);
			$dialog->setAttribute('class','dialog');
			$dialog->setAttribute('title',sprintf(translateFN('Gestione risposte per la posizione %d'),$ord));
			$dialog->addChild(new CText('<p>'.sprintf(translateFN('Elemento in posizione %d: %s'),$ord,$this->answers[$i]).'</p>'));

			$form = CDOMElement::create('form','method:POST');
			$input = CDOMElement::create('hidden','name:return,value:here');
			$form->addChild($input);
			$fieldset = CDOMElement::create('fieldset','class:form');
			$ol = CDOMElement::create('ol','class:form');

			$r = new AnswerHeaderControlTest(false,$this->case_sensitive,$this->modifiable,$isDragDrop);
			$li = CDOMElement::create('li','class:form');
			$li->addChild(new CText($r->render()));
			$ol->addChild($li);

			if (!empty($v)) {
				foreach($v as $answer) {
					$li = CDOMElement::create('li','class:form');
					$r = new AnswerClozeControlTest($this->case_sensitive,$answer['record'],false,$this->modifiable,$isDragDrop);
					$r->withData($answer);
					$li->addChild(new CText($r->render()));
					$ol->addChild($li);
				}
			}
			else {
				$li = CDOMElement::create('li','class:form');
				$r = new AnswerClozeControlTest($this->case_sensitive,null,null,false,$isDragDrop);
				$r->withData(array('ordine'=>$ord));
				$li->addChild(new CText($r->render()));
				$ol->addChild($li);
			}


			if ($this->modifiable) {
				$li = CDOMElement::create('li');
				$li->setAttribute('class', 'form hidden');
				$hidden_record = new AnswerClozeControlTest($this->case_sensitive,null,true,$this->modifiable,$isDragDrop);
				$hidden_record->withData(array('ordine'=>$ord));
				$li->addChild(new CText($hidden_record->render()));
				$ol->addChild($li);

				$r = new AnswerFooterControlTest($this->modifiable);
				$li = CDOMElement::create('li','class:form');
				$li->addChild(new CText($r->render()));
				$ol->addChild($li);
			}

			$fieldset->addChild($ol);
			$form->addChild($fieldset);
			$dialog->addChild($form);
			$div->addChild($dialog);
		}

		$this->html = $div;
	}

	protected function clozePlaceholder($params) {
		$ordine = $params[1];
		$answer = $params[2];
		$this->ordine[] = $ordine;
		$this->answers[] = $answer;

		return $this->questionObj->clozePlaceholder($params);
	}

	public function render() {
		return $this->html->getHtml();
	}
}